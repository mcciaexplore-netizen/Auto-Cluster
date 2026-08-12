import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLifeCategory, lifeCategories } from '@/content/life'
import { PendingPage } from '@/components/blocks/PendingPage'

export function generateStaticParams() {
  return lifeCategories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const found = getLifeCategory(category)
  if (!found) return {}
  return { title: `${found.title} — Life at Auto Cluster` }
}

export default async function LifeCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const found = getLifeCategory(category)
  if (!found) notFound()

  return (
    <PendingPage
      eyebrow="Life at Auto Cluster"
      title={found.title}
      subtitle="Photographs and write-ups from our programme."
      reason={`The /announcement/${category}/ page is awaiting a verbatim capture from the live site.`}
      question="CQ-67"
    />
  )
}
