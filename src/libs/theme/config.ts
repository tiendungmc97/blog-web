export const themeConfigs = (isDark: boolean) => ({
  token: {
    // Color tokens
    colorPrimary: "#1d4ed8",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
    colorError: "#dc2626",
    colorInfo: "#3b82f6",

    // Base colors
    colorBgBase: isDark ? "#0f172a" : "#ffffff",
    colorBgContainer: isDark ? "#1e293b" : "#ffffff",
    colorBgElevated: isDark ? "#334155" : "#ffffff",
    colorBgLayout: isDark ? "#020617" : "#f8fafc",

    // Text colors
    colorTextBase: isDark ? "#f1f5f9" : "#0f172a",
    colorText: isDark ? "#e2e8f0" : "#334155",
    colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
    colorTextTertiary: isDark ? "#64748b" : "#94a3b8",
    colorTextQuaternary: isDark ? "#475569" : "#cbd5e1",

    // Border colors
    colorBorder: isDark ? "#475569" : "#e2e8f0",
    colorBorderSecondary: isDark ? "#334155" : "#f1f5f9",

    // Typography
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Spacing
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // Border radius
    borderRadius: 8,
    borderRadiusXS: 4,
    borderRadiusSM: 4,
    borderRadiusLG: 12,

    // Shadows
    boxShadow: isDark ? "0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary: isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  components: {
    // Button theming
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontSize: 14,
      fontWeight: 500,
      paddingInline: 16,
      paddingInlineSM: 12,
      paddingInlineLG: 20,

      // Primary button
      colorPrimary: "#1d4ed8",
      colorPrimaryHover: "#2563eb",
      colorPrimaryActive: "#1e40af",
      colorPrimaryBorder: "#1d4ed8",
      primaryShadow: `0 2px 4px #1d4ed825`,

      // Default button
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorBorder: isDark ? "#475569" : "#e2e8f0",
      colorText: isDark ? "#f1f5f9" : "#334155",
      colorTextDisabled: isDark ? "#64748b" : "#94a3b8",
      colorBgContainerDisabled: isDark ? "#0f172a" : "#f8fafc",
      colorBorderDisabled: isDark ? "#334155" : "#f1f5f9",

      // Shadows
      defaultShadow: isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
      dangerShadow: `0 2px 4px #dc262625`,
    },

    // Input theming
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightSM: 32,
      controlHeightLG: 48,
      fontSize: 14,
      paddingInline: 12,

      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorBorder: isDark ? "#475569" : "#e2e8f0",
      colorBorderHover: isDark ? "#64748b" : "#cbd5e1",
      colorPrimaryBorder: "#1d4ed8",
      colorPrimaryHover: "#2563eb",
      colorText: isDark ? "#f1f5f9" : "#0f172a",
      colorTextPlaceholder: isDark ? "#64748b" : "#94a3b8",
      colorIcon: isDark ? "#94a3b8" : "#64748b",
      colorIconHover: isDark ? "#e2e8f0" : "#334155",

      boxShadow: isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
      activeShadow: `0 0 0 2px #1d4ed833`,
    },

    // Card theming
    Card: {
      borderRadius: 12,
      colorBorderSecondary: isDark ? "#334155" : "#f1f5f9",
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorTextHeading: isDark ? "#f1f5f9" : "#0f172a",
      colorText: isDark ? "#e2e8f0" : "#334155",

      boxShadow: isDark ? "0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      boxShadowHover: isDark ? "0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)" : "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",

      headerBg: isDark ? "#0f172a" : "#f8fafc",
      headerHeight: 56,
      headerFontSize: 16,
      headerFontSizeSM: 14,
      bodyPadding: 16,
      paddingLG: 24,
    },

    // Tabs theming
    Tabs: {
      borderRadius: 8,
      colorBorderSecondary: isDark ? "#334155" : "#f1f5f9",
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorText: isDark ? "#94a3b8" : "#64748b",
      colorTextActive: isDark ? "#f1f5f9" : "#0f172a",
      colorPrimary: "#1d4ed8",
      colorPrimaryHover: "#2563eb",
      colorPrimaryActive: "#1e40af",
      colorFillAlter: isDark ? "#0f172a" : "#f8fafc",
      itemColor: isDark ? "#94a3b8" : "#64748b",
      itemHoverColor: isDark ? "#e2e8f0" : "#334155",
      itemSelectedColor: "#1d4ed8",
      itemActiveColor: "#1e40af",
      cardBg: isDark ? "#0f172a" : "#f8fafc",
      cardHeight: 40,
      cardPadding: `16px 24px`,
      cardGutter: 4,
      titleFontSize: 14,
      titleFontSizeLG: 16,
      titleFontSizeSM: 12,
      inkBarColor: "#1d4ed8",
    },

    // Menu theming
    Menu: {
      colorBgContainer: "transparent",
      colorTextSelected: "#ffffff",
      colorIcon: "#ffffff",
      colorIconSelected: "#ffffff",
      itemBg: "transparent",
      itemHoverBg: "rgba(255, 255, 255, 0.08)",
      activeBarBorderWidth: 0,
      subMenuItemBg: "transparent",
      itemColor: "#ffffff",
      itemSelectedColor: "black",
      itemHoverColor: "#ffffff",
      groupTitleColor: "#ffffff",
      borderRadius: 0,
      itemHeight: 40,
      itemPaddingInline: 16,
      subMenuItemSelectedColor: "white",
      itemBorderRadius: 0,
      itemMarginBlock: 0,
      itemMarginInline: 0,
    },

    // Form theming
    Form: {
      labelFontSize: 14,
      labelColor: isDark ? "#e2e8f0" : "#334155",
      labelRequiredMarkColor: "#dc2626",
      itemMarginBottom: 16,
    },

    // Select theming
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      fontSize: 14,
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorBorder: isDark ? "#475569" : "#e2e8f0",
      colorText: isDark ? "#f1f5f9" : "#0f172a",
      colorTextPlaceholder: isDark ? "#64748b" : "#94a3b8",
      optionSelectedBg: isDark ? "#334155" : "#f1f5f9",
      optionActiveBg: isDark ? "#475569" : "#e2e8f0",
    },

    // Modal theming
    Modal: {
      borderRadius: 12,
      colorBgElevated: isDark ? "#1e293b" : "#ffffff",
      colorText: isDark ? "#e2e8f0" : "#334155",
      colorTextHeading: isDark ? "#f1f5f9" : "#0f172a",
      headerBg: isDark ? "#0f172a" : "#ffffff",
      contentBg: isDark ? "#1e293b" : "#ffffff",
      footerBg: isDark ? "#0f172a" : "#f8fafc",
    },
  },
});
