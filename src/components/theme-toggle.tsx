"use client";

import { SessionStorageKeys } from "@/constants/keys";
import { Theme } from "@/libs/theme/types";
import { Button } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        shape="circle"
        className="flex items-center justify-center"
      />
    );
  }
  const changeTheme = () => {
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    document.cookie = `${SessionStorageKeys.THEME}=${newTheme}; path=/;`;
    setTheme(newTheme);
  };
  return (
    <Button
      shape="circle"
      onClick={changeTheme}
      className="flex items-center justify-center"
      type="primary"
    >
      {theme === Theme.DARK ? "Dark" : "Light"}
    </Button>
  );
}
