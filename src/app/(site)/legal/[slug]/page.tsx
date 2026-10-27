import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLegalPage, legalPages } from '@/content/life'
import { PendingPage } from '@/components/blocks/PendingPage'

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) return {}
  return { title: page.title, description: page.summary, robots: { index: true, follow: true } }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) notFound()

  return (
    <PendingPage
      eyebrow="Legal"
      title={page.title}
      subtitle={page.summary}
      reason={page.reason}
      question={'question' in page ? page.question : undefined}
    />
  )
}
