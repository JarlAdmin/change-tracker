"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme
    console.log('Initial theme from storage:', storedTheme)
    return storedTheme || defaultTheme
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    console.log('Applying theme:', theme)

    // First, remove both classes
    root.classList.remove('light', 'dark')

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      console.log('System theme:', systemTheme)
      root.classList.add(systemTheme)
    } else {
      console.log('Adding theme class:', theme)
      root.classList.add(theme)
    }

    // Force a repaint to ensure the theme is applied
    document.body.style.display = 'none'
    document.body.offsetHeight // Force reflow
    document.body.style.display = ''

  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        console.log('Setting new theme:', newTheme)
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      },
    }),
    [theme, storageKey]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
