/**
 * Build-time notes.
 *
 * During the rebuild it is useful for ACDRI and the team to see, in the page
 * itself, which content is still blocked and on what. None of it belongs on
 * the live site — it is internal project commentary, not visitor copy.
 *
 * Off in production unless explicitly enabled, so a staging review can show
 * the notes and the public site never does.
 */
export const showBuildNotes =
  process.env.NEXT_PUBLIC_SHOW_BUILD_NOTES === 'true' ||
  (process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_SHOW_BUILD_NOTES !== 'false')
