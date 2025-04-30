"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define color theme and mode types
type ColorTheme = "default" | "blue" | "green" | "purple" | "orange" | "nord" | "cyberpunk" | "minimal";
type Mode = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultColorTheme?: ColorTheme;
  defaultMode?: Mode;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
  resolvedMode: "light" | "dark"; // The actual mode after system preference is resolved
};

const initialState: ThemeProviderState = {
  colorTheme: "default",
  mode: "system",
  setColorTheme: () => null,
  setMode: () => null,
  resolvedMode: "light"
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultColorTheme = "default",
  defaultMode = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Handle mode changes and system preference
  useEffect(() => {
    const root = window.document.documentElement;

    // Clean up all theme-related classes before applying new ones
    const themeClasses = [
      "light", "dark", 
      "blue", "blue-light", "blue-dark",
      "green", "green-light", "green-dark",
      "purple", "purple-light", "purple-dark",
      "orange", "orange-light", "orange-dark",
      "nord", "nord-light", "nord-dark",
      "cyberpunk", "cyberpunk-light", "cyberpunk-dark",
      "minimal", "minimal-light", "minimal-dark"
    ];
    
    root.classList.remove(...themeClasses);

    // Determine mode (light/dark) based on system preference if needed
    let currentMode = mode;
    if (mode === "system" && enableSystem) {
      currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Store the resolved mode for other components to use
    setResolvedMode(currentMode as "light" | "dark");

    // Apply mode class
    root.classList.add(currentMode);

    // Apply color theme class if not default
    if (colorTheme !== "default") {
      root.classList.add(colorTheme);
      // Add combined mode and theme class
      root.classList.add(`${colorTheme}-${currentMode}`);
    }
  }, [colorTheme, mode, enableSystem]);

  // Listen for system theme changes if using system mode
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (mode === "system") {
        const newResolvedMode = mediaQuery.matches ? "dark" : "light";
        setResolvedMode(newResolvedMode);
        
        // Update classes when system preference changes
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newResolvedMode);
        
        if (colorTheme !== "default") {
          const themeClasses = [`${colorTheme}-light`, `${colorTheme}-dark`];
          root.classList.remove(...themeClasses);
          root.classList.add(`${colorTheme}-${newResolvedMode}`);
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, colorTheme, enableSystem]);

  const value = {
    colorTheme,
    mode,
    resolvedMode,
    setColorTheme: (newColorTheme: ColorTheme) => {
      if (disableTransitionOnChange) {
        document.documentElement.classList.add("no-transition");
        window.setTimeout(() => {
          document.documentElement.classList.remove("no-transition");
        }, 0);
      }
      setColorTheme(newColorTheme);
    },
    setMode: (newMode: Mode) => {
      if (disableTransitionOnChange) {
        document.documentElement.classList.add("no-transition");
        window.setTimeout(() => {
          document.documentElement.classList.remove("no-transition");
        }, 0);
      }
      setMode(newMode);
    }
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
