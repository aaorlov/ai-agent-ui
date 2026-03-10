import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "ai-agent-ui-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    getResolvedTheme(getStoredTheme())
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    const resolvedTheme = getResolvedTheme(theme);
    setResolved(resolvedTheme);
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, resolved }),
    [theme, setTheme, resolved]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
