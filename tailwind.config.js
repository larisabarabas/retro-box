/**
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
        },
        "gray-text": "var(--color-gray-text)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--surface)",
        "card-border": "var(--border-color)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        card: "var(--shadow-card)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
