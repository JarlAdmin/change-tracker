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
  // Initialize theme from localStorage or default
  const [theme, setTheme] = React.useState<Theme>(() => {
    // Clear existing theme from localStorage to start fresh
    localStorage.removeItem(storageKey);
    return defaultTheme;
  });

  // Apply theme effect
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // First, remove any existing theme classes
    root.classList.remove('light', 'dark');

    // Apply the appropriate theme
    if (theme === 'system') {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      console.log('Applied system theme:', systemTheme);
    } else {
      root.classList.add(theme);
      console.log('Applied theme:', theme);
    }

    // Store the theme preference
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Create memoized context value
  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        console.log('Setting new theme:', newTheme);
        setTheme(newTheme);
      },
    }),
    [theme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
