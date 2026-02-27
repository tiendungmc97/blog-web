"use client";

import "@ant-design/v5-patch-for-react-19";
import type React from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider, theme as themAlgorithm } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { useLayoutEffect, useMemo } from "react";
import { themeConfigs } from "./config";
import { Theme } from "./types";

function AntdConfigProvider({ children, initTheme }: { children: React.ReactNode; initTheme: Theme }) {
  const { setTheme } = useTheme();
  const isDark = initTheme === Theme.DARK;
  useLayoutEffect(() => {
    setTheme(initTheme);
  }, [initTheme, setTheme]);
  const antdTheme = useMemo(
    () => ({
      algorithm: isDark ? themAlgorithm.darkAlgorithm : themAlgorithm.defaultAlgorithm,
      token: themeConfigs(isDark).token,
      components: themeConfigs(isDark).components,
    }),
    [isDark],
  );

  return (
    <ConfigProvider theme={antdTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

function AntdProviders({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <ThemeProvider
      enableSystem={false}
      storageKey="theme"
      themes={[Theme.LIGHT, Theme.DARK]}
      forcedTheme={theme}
      defaultTheme={theme}
      attribute="class"
    >
      <AntdConfigProvider initTheme={theme}>{children}</AntdConfigProvider>
    </ThemeProvider>
  );
}

export function ThemeProviders({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <AntdRegistry>
      <AntdProviders theme={theme}>{children}</AntdProviders>
    </AntdRegistry>
  );
}
