// @ts-nocheck
import { useEffect, useState } from "react";

export function useDarkTheme() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return null;
  });

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = (event) => {
      document.documentElement.classList.toggle("dark", event.matches);
    };

    if (darkTheme === true) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (darkTheme === false) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.toggle("dark", systemTheme.matches);
      localStorage.removeItem("theme");
      systemTheme.addEventListener("change", handleColorSchemeChange);
    }
    return () => {
      systemTheme.removeEventListener("change", handleColorSchemeChange);
    };
  }, [darkTheme]);

  return [darkTheme, setDarkTheme];
}
