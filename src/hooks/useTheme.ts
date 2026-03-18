import { useState, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'sunset'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'sunset') {
    return stored
  }
  return 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t
    localStorage.setItem('theme', t)
    setThemeState(t)
  }, [])

  // Ensure DOM matches state on first render
  document.documentElement.dataset.theme = theme

  return { theme, setTheme }
}
