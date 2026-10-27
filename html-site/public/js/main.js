// Mobile nav drawer — replaces the useState toggle in the old React Header.
const toggle = document.querySelector('[data-nav-toggle]')
const panel = document.querySelector('[data-nav-panel]')
const icon = document.querySelector('[data-nav-icon]')

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    const open = panel.hasAttribute('hidden')
    if (open) {
      panel.removeAttribute('hidden')
      toggle.setAttribute('aria-expanded', 'true')
      if (icon) icon.textContent = '✕'
    } else {
      panel.setAttribute('hidden', '')
      toggle.setAttribute('aria-expanded', 'false')
      if (icon) icon.textContent = '☰'
    }
  })
}
