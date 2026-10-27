const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const Module = require('node:module')
const test = require('node:test')
const ts = require('typescript')

// Compile the project's TypeScript in memory. Tests use an isolated data directory.
const root = path.resolve(__dirname, '..')
const originalResolver = Module._resolveFilename
Module._resolveFilename = function(request, ...args) {
  return originalResolver.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, ...args)
}
Module._extensions['.ts'] = (module, file) => {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } })
  module._compile(compiled.outputText, file)
}
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'autocluster-platform-test-'))
process.chdir(temporary)
const { enquirySchema } = require('../src/lib/validation.ts')
const { amountSchema, eventSchema } = require('../src/lib/platform.ts')
const { createEnquiry, getEnquiry, listEnquiries, listEnquiryAssignees, assignEnquiry, updateEnquiryStatus } = require('../src/server/enquiries.ts')
const { changeBooking, listBookings, validCheckoutUrl } = require('../src/server/bookings.ts')
const { insert, findAll, findById } = require('../src/server/store.ts')
const { registerForEvent, getFixedRate } = require('../src/server/platform.ts')
const { saveVenueDocument } = require('../src/server/venue-documents.ts')
const { can, roles } = require('../src/server/roles.ts')
const manager = { role: 'venue-manager', id: 'manager', active: true, department: null, name: 'Venue manager', email: 'venue@example.invalid' }
const accounts = { role: 'accounts', id: 'accounts', active: true, department: null, name: 'Accounts', email: 'accounts@example.invalid' }
const form = (data) => { const f = new FormData(); for (const [k,v] of Object.entries(data)) f.set(k,v); return f }
const base = { name: 'Test Requester', company: 'Example Test Co', email: 'requester@example.invalid', phone: '9876543210', serviceId: 'venue-hire', kind: 'venue', message: 'Conference and presentation setup required.', consent: true, formRenderedAt: Date.now() - 5000, venueSlug: 'auditorium', roomUse: 'conference', startsAt: '2099-05-10T09:00', endsAt: '2099-05-10T17:00', attendees: '50', eventType: 'Industry seminar', floorPlanRequested: true }

async function main() {
  await test('Service fields reject mismatches, impossible dates and reversed time ranges', () => {
    assert.equal(enquirySchema.safeParse(base).success, true)
    for (const patch of [{ serviceId: 'general' }, { attendees: '0' }, { startsAt: '2099-02-30T09:00' }, { endsAt: '2099-05-10T08:00' }, { startsAt: '2000-05-10T09:00' }, { venueSlug: 'invented-room' }, { consent: false }]) assert.equal(enquirySchema.safeParse({ ...base, ...patch }).success, false)
    assert.equal(enquirySchema.safeParse({ ...base, kind: 'startup', serviceId: 'startup-incubation', startupName: 'Test Venture', stage: 'prototype', supportNeeded: 'Need environmental testing support.' }).success, true)
    assert.equal(amountSchema.safeParse('-100').success, false)
    assert.equal(amountSchema.safeParse('1.234').success, false)
    assert.equal(amountSchema.parse('1234.50'), 123450)
  })
  let first, second
  await test('Booking requests persist structured requirements and independent private tokens', async () => {
    first = await createEnquiry(enquirySchema.parse(base), { source: null })
    second = await createEnquiry(enquirySchema.parse({ ...base, email: 'second@example.invalid' }), { source: null })
    assert.equal((await getEnquiry(first.id, manager)).fields.floorPlanRequested, true)
    assert.match(first.booking.accessToken, /^[a-f0-9]{64}$/)
    assert.notEqual(first.booking.accessToken, second.booking.accessToken)
    assert.equal(first.booking.status, 'requested')
  })
  await test('Role separation and approval-before-payment are enforced on the server', async () => {
    assert(roles.every((role) => !(can({role}, 'bookings:approve') && can({role}, 'payments:record'))))
    await assert.rejects(changeBooking(first.id, 'approve', form({amount:'100'}), accounts), /permission/)
    await assert.rejects(changeBooking(first.id, 'record-payment', form({receipt:'TEST-1',verified:'on'}), manager), /permission/)
    await assert.rejects(changeBooking(first.id, 'record-payment', form({receipt:'TEST-1',verified:'on'}), accounts), /approve/)
  })
  await test('Concurrent approvals cannot double-book one venue', async () => {
    const results = await Promise.allSettled([first,second].map((r) => changeBooking(r.id, 'approve', form({amount:'1250.50'}), manager)))
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
    assert.match(results.find((r) => r.status === 'rejected').reason.message, /overlap/)
    first = (await getEnquiry(first.id, manager)).booking.status === 'approved' ? first : second
  })
  await test('Hosted payment URLs fail closed and verified receipts are required', async () => {
    process.env.PAYMENT_LINK_HOSTS = ''
    assert.equal(validCheckoutUrl('https://payments.example.invalid/test'), false)
    process.env.PAYMENT_LINK_HOSTS = 'payments.example.invalid'
    for (const url of ['javascript:alert(1)', 'http://payments.example.invalid/test', 'https://payments.example.invalid.evil.test', 'https://user@payments.example.invalid', 'https://payments.example.invalid:8443/test']) assert.equal(validCheckoutUrl(url), false)
    await changeBooking(first.id, 'payment-link', form({checkoutUrl:'https://payments.example.invalid/test'}), accounts)
    assert.equal((await getEnquiry(first.id, manager)).booking.paidReference, null)
    await assert.rejects(changeBooking(first.id, 'record-payment', form({receipt:'TEST-RECEIPT'}), accounts), /Confirm/)
    await changeBooking(first.id, 'record-payment', form({receipt:'TEST-RECEIPT', verified:'on'}), accounts)
    assert.equal((await getEnquiry(first.id, manager)).booking.paidReference, 'TEST-RECEIPT')
    await assert.rejects(changeBooking(first.id, 'record-payment', form({receipt:'TEST-RECEIPT',verified:'on'}), accounts), /already/)
  })
  await test('Private floor plans require an approved matching booking', async () => {
    const document = await saveVenueDocument('auditorium', 'Test plan', 'floor-plan', new File(['%PDF-1.4\n%%EOF'], 'plan.pdf'), 'manager')
    const { GET } = require('../src/app/api/bookings/[token]/documents/[id]/route.ts')
    const read = (token, id) => GET(new Request('http://localhost/test'), {params:Promise.resolve({token,id})})
    assert.equal((await read('bad-token', document.id)).status, 404)
    const pending = await createEnquiry(enquirySchema.parse({...base, startsAt:'2099-06-10T09:00',endsAt:'2099-06-10T17:00'}),{source:null})
    assert.equal((await read(pending.booking.accessToken, document.id)).status, 404)
    const response = await read(first.booking.accessToken, document.id)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('cache-control'), /no-store/)
    const wrongVenue = await saveVenueDocument('exhibition-centre', 'Other plan', 'floor-plan', new File(['%PDF-1.4\n%%EOF'], 'plan.pdf'), 'manager')
    assert.equal((await read(first.booking.accessToken, wrongVenue.id)).status, 404)
    await assert.rejects(saveVenueDocument('auditorium', 'Bad file', 'floor-plan', new File(['not a PDF'], 'plan.pdf'), 'manager'), /PDF/)
  })
  const eventFields = {title:'Test workshop',slug:'test-workshop',description:'A test workshop for capacity checks.',startsAt:'2099-05-10T10:00',endsAt:'2099-05-10T12:00',location:'Test hall',capacity:1,category:'training',published:true,registrationOpen:true}
  await test('Concurrent event registrations respect capacity without issuing extra passes', async () => {
    assert(eventSchema.safeParse(eventFields).success)
    await insert('events', {...eventFields, registrations:[]})
    const results = await Promise.allSettled(['a','b'].map((n) => registerForEvent('test-workshop', {name:`Test ${n}`,email:`${n}@example.invalid`,company:''})))
    assert.equal(results.filter((r) => r.status === 'fulfilled').length,1)
    assert.match(results.find((r) => r.status === 'rejected').reason.message,/capacity/)
    assert.match(results.find((r) => r.status === 'fulfilled').value.token,/^[a-f0-9]{64}$/)
  })
  await test('Duplicate registrations and draft or closed events cannot issue passes', async () => {
    const event = (await findAll('events'))[0]
    await assert.rejects(registerForEvent(event.slug,event.registrations[0]),/already exists/)
    await insert('events', {...eventFields,slug:'draft-event',published:false,registrations:[]})
    await insert('events', {...eventFields,slug:'closed-event',registrationOpen:false,registrations:[]})
    for(const slug of ['draft-event','closed-event','missing-event']) await assert.rejects(registerForEvent(slug,{name:'Test',email:'x@example.invalid',company:''}),/closed/)
  })
  await test('Only approved rates effective today are returned', async () => {
    assert.equal(await getFixedRate('equipment:unknown'), undefined)
    await insert('fixed-rates',{key:'equipment:test',amountPaise:12300,unit:'Per hour',effectiveFrom:'2020-01-01',taxNote:'Tax included',approvedBy:'test'})
    await insert('fixed-rates',{key:'equipment:test',amountPaise:45600,unit:'Per hour',effectiveFrom:'2099-01-01',taxNote:'Tax included',approvedBy:'test'})
    assert.equal((await getFixedRate('equipment:test')).amountPaise,12300)
  })
  await test('Event API rejects malformed and invalid submissions', async () => {
    const { POST } = require('../src/app/api/events/[slug]/register/route.ts')
    assert.equal((await POST(new Request('http://localhost/test',{method:'POST',body:'bad JSON'}),{params:Promise.resolve({slug:'test-workshop'})})).status,400)
    assert.equal((await POST(new Request('http://localhost/test',{method:'POST',body:JSON.stringify({name:'T',email:'bad',company:'',consent:false})}),{params:Promise.resolve({slug:'test-workshop'})})).status,422)
  })
  const staff = async (role, department = null, active = true) => insert('staff-users', { role, department, active, name: role + ' reviewer', email: role + '@example.invalid', passwordHash: 'test-only', passwordSalt: 'test-only' })
  const marketing = await staff('marketing')
  const testingHead = await staff('hod', 'testing')
  const unscopedHead = await staff('hod')
  const training = await staff('training-coordinator')
  const venueOwner = await staff('venue-manager')
  const inactive = await staff('hod', 'testing', false)
  const editor = await staff('editor')
  const { id: fixtureId, createdAt: fixtureCreated, updatedAt: fixtureUpdated, booking: fixtureBooking, ...enquiryFields } = await findById('enquiries', first.id)
  const testing = await insert('enquiries', { ...enquiryFields, referenceCode: 'AC-TEST-SEARCH', kind: 'testing', department: 'testing', serviceId: 'environmental-testing', company: 'Search Example Company', needsRoutingReview: true })
  const trainingRequest = await insert('enquiries', { ...enquiryFields, referenceCode: 'AC-TRAINING', kind: 'general', department: 'training', needsRoutingReview: false })

  await test('Enquiry lists and direct reads enforce every role scope, including an unconfigured HOD', async () => {
    for (const [actor, department] of [[manager, 'venue'], [training, 'training'], [testingHead, 'testing']]) {
      const records = await listEnquiries(actor)
      assert(records.length > 0)
      assert(records.every((r) => r.department === department))
    }
    assert.equal(await getEnquiry(testing.id, manager), undefined)
    assert.equal(await getEnquiry(first.id, training), undefined)
    assert.equal(await getEnquiry(trainingRequest.id, testingHead), undefined)
    assert.equal(await getEnquiry(testing.id, accounts), undefined)
    assert.equal(await getEnquiry(testing.id, inactive), undefined)
    assert.deepEqual(await listEnquiries(unscopedHead), [])
    assert.deepEqual(await listEnquiries(manager, { department: 'testing' }), [])
    for (const actor of [accounts, editor, inactive]) await assert.rejects(listEnquiries(actor), /permission/)
    assert((await listEnquiries(marketing)).some((r) => r.id === testing.id))
  })
  await test('Assignments reject inactive, missing and wrong-department owners and unauthorized actors', async () => {
    const candidates = await listEnquiryAssignees(testing.id, marketing)
    assert(candidates.some((u) => u.id === testingHead.id))
    assert(candidates.every((u) => ![venueOwner.id, inactive.id, editor.id, unscopedHead.id].includes(u.id)))
    assert(candidates.every((u) => Object.keys(u).sort().join(',') === 'id,name,role'))
    for (const owner of [venueOwner.id, inactive.id, editor.id, 'missing-user']) await assert.rejects(assignEnquiry(testing.id, owner, marketing, null), /active staff member/)
    await assert.rejects(assignEnquiry(first.id, marketing.id, testingHead, null), /access denied/)
    await assert.rejects(assignEnquiry(testing.id, testingHead.id, manager, null), /permission/)
    assert.equal((await getEnquiry(testing.id, marketing)).assignedTo, null)
  })
  await test('Concurrent ownership changes preserve one winner and append its audit history', async () => {
    const results = await Promise.allSettled([testingHead.id, marketing.id].map((owner) => assignEnquiry(testing.id, owner, marketing, null)))
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
    assert.match(results.find((r) => r.status === 'rejected').reason.message, /owner changed/)
    const saved = await getEnquiry(testing.id, marketing)
    assert.equal(saved.status, 'assigned')
    assert.equal(saved.owner.id, saved.assignedTo)
    assert.deepEqual(Object.keys(saved.owner).sort(), ['active', 'id', 'name'])
    const audit = (await findAll('audit-log')).filter((e) => e.targetId === testing.id && e.action === 'enquiry.assigned')
    assert.equal(audit.length, 1)
    assert.equal(audit[0].actorId, marketing.id)
    assert.equal(audit[0].metadata.assigneeId, saved.assignedTo)
  })
  await test('Search and combined ownership, routing, status and department filters retain scope', async () => {
    const assigned = await getEnquiry(testing.id, marketing)
    const owner = assigned.assignedTo === marketing.id ? marketing : testingHead
    const filters = { query: '  SEARCH EXAMPLE  ', status: 'assigned', department: 'testing', ownership: 'mine', needsRoutingReview: true }
    assert.deepEqual((await listEnquiries(owner, filters)).map((e) => e.id), [testing.id])
    assert.deepEqual(await listEnquiries(manager, filters), [])
    assert.equal((await listEnquiries(marketing, { query: testing.referenceCode })).length, 1)
    assert.equal((await listEnquiries(marketing, { ownership: 'unassigned' })).some((e) => e.id === testing.id), false)
    assert.deepEqual(await listEnquiries(marketing, { query: 'no such requester' }), [])
  })
  await test('Status changes reject cross-department writes, stale forms and ownerless Assigned status', async () => {
    await assert.rejects(updateEnquiryStatus(first.id, 'contacted', testingHead, 'new'), /access denied/)
    await assert.rejects(updateEnquiryStatus(first.id, 'contacted', manager, 'new'), /permission/)
    await assert.rejects(updateEnquiryStatus(testing.id, 'invalid-status', marketing, 'assigned'), /valid enquiry status/)
    const results = await Promise.allSettled(['contacted', 'quoted'].map((status) => updateEnquiryStatus(testing.id, status, testingHead, 'assigned')))
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
    assert.match(results.find((r) => r.status === 'rejected').reason.message, /status changed/)
    const saved = await getEnquiry(testing.id, marketing)
    await assignEnquiry(testing.id, null, marketing, saved.assignedTo)
    assert.equal((await getEnquiry(testing.id, marketing)).status, saved.status)
    await assert.rejects(updateEnquiryStatus(testing.id, 'assigned', marketing, saved.status), /Assign an owner/)
    assert.equal((await getEnquiry(testing.id, marketing)).status, saved.status)
    const audit = (await findAll('audit-log')).filter((e) => e.targetId === testing.id && e.action === 'enquiry.status-changed')
    assert.equal(audit.length, 1)
  })
  await test('Legacy unassigned records can be assigned and returned to the new queue', async () => {
    const { assignedTo, assignedBy, assignedAt, ...legacyFields } = enquiryFields
    const legacy = await insert('enquiries', { ...legacyFields, department: 'venue', referenceCode: 'AC-LEGACY' })
    assert.equal((await getEnquiry(legacy.id, marketing)).owner, null)
    await assignEnquiry(legacy.id, venueOwner.id, marketing, null)
    assert.equal((await getEnquiry(legacy.id, marketing)).status, 'assigned')
    await assignEnquiry(legacy.id, null, marketing, venueOwner.id)
    assert.equal((await getEnquiry(legacy.id, marketing)).status, 'new')
    assert((await listEnquiries(marketing, {ownership: 'unassigned'})).some((e) => e.id === legacy.id))
  })
  await test('Booking queue permissions and payment filters do not expose other enquiries', async () => {
    for (const actor of [marketing, training, testingHead, { ...accounts, active: false }]) await assert.rejects(listBookings(actor), /permission/)
    const paid = await listBookings(accounts, { state: 'paid', query: first.referenceCode.toLowerCase() })
    assert.equal(paid.length, 1)
    assert.equal(paid[0].id, first.id)
    assert.equal((await listBookings(accounts, { state: 'awaiting-payment' })).some((e) => e.id === first.id), false)
    const pending = await listBookings(manager, { state: 'requested' })
    assert(pending.length > 0)
    assert(pending.every((e) => e.kind === 'venue' && e.booking.status === 'requested'))
    await assert.rejects(changeBooking(pending[0].id, 'approve', form({amount: '100'}), { ...manager, active: false }), /permission/)
  })
}
main().catch((error) => { console.error(error); process.exitCode = 1 }).finally(() => {
  process.chdir(root)
  const resolved = path.resolve(temporary)
  if (!resolved.startsWith(path.join(path.resolve(os.tmpdir()), 'autocluster-platform-test-'))) throw new Error('Unsafe cleanup target')
  fs.rmSync(resolved, {recursive:true,force:true})
})
