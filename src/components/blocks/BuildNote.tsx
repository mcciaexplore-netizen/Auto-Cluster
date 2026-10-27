import { showBuildNotes } from '@/lib/flags'

/**
 * An internal note about blocked or pending content.
 * Renders nothing in production. See src/lib/flags.ts.
 */
export function BuildNote({
  children,
  question,
  variant = 'inline',
}: {
  children: React.ReactNode
  /** The CONTENT_QUESTIONS.md reference this is blocked on, e.g. "CQ-50". */
  question?: string
  variant?: 'inline' | 'banner'
}) {
  if (!showBuildNotes) return null

  if (variant === 'banner') {
    return (
      <div className="bg-flag-warn-bg border-b border-flag-warn-edge">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-4">
          <p className="text-[13.5px] text-flag-warn-fg m-0 max-w-none">
            <strong className="font-semibold">Content pending.</strong> {children}
            {question && ` See CONTENT_QUESTIONS.md ${question}.`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <p className="mt-5 text-[13.5px] text-flag-warn-fg border-l-2 border-flag-warn-edge pl-3">
      {children}
      {question && ` See CONTENT_QUESTIONS.md ${question}.`}
    </p>
  )
}
