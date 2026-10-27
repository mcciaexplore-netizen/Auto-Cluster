'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
export function OptionalMap({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  return <div className="rounded-md overflow-hidden border border-rule min-h-56 bg-paper-2">
    {loaded ? <><iframe src={src} title={title} referrerPolicy="no-referrer" className="w-full h-72 border-0" /><button type="button" onClick={() => setLoaded(false)} className="min-h-11 px-4 underline text-sm">Close map</button></> :
    <div className="p-7"><h4 className="text-lg">View the map</h4><p className="text-sm text-ink-700 mt-3 mb-5">Loading this map connects to Google Maps, which may use cookies and receive your IP address.</p><Button type="button" variant="secondary" onClick={() => setLoaded(true)}>Load Google Maps</Button></div>}
  </div>
}
