import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "430px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Nova Square', 'sans-serif'],
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        accent: ['Inria Serif', 'serif'],
      },
      fontSize: {
        'h1': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.375rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          elevated: "hsl(var(--card-elevated))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Game-specific colors (muted/dark)
        stat: {
          str: "hsl(var(--stat-str))",
          int: "hsl(var(--stat-int))",
          end: "hsl(var(--stat-end))",
          wil: "hsl(var(--stat-wil))",
          soc: "hsl(var(--stat-soc))",
        },
        rarity: {
          common: "hsl(var(--rarity-common))",
          uncommon: "hsl(var(--rarity-uncommon))",
          rare: "hsl(var(--rarity-rare))",
          legendary: "hsl(var(--rarity-legendary))",
        },
        difficulty: {
          easy: "hsl(var(--difficulty-easy))",
          medium: "hsl(var(--difficulty-medium))",
          hard: "hsl(var(--difficulty-hard))",
        },
        status: {
          online: "hsl(var(--online))",
          offline: "hsl(var(--offline))",
          warning: "hsl(var(--warning))",
        },
        // Direct color values for the dark theme
        dark: {
          ultra: "#0A0A0F",
          gray: "#111111",
          charcoal: "#1A1A2E",
          purple: "#2D1B4E",
        },
        cyan: {
          neon: "#00D9FF",
        },
        // SoloRank Theme Colors
        emerald: {
          DEFAULT: "#35D475",
          glow: "rgba(53, 212, 117, 0.3)",
          light: "rgba(53, 212, 117, 0.6)",
          dark: "rgba(53, 212, 117, 0.15)",
        },
        pheromone: {
          DEFAULT: "#8127B9",
          glow: "rgba(129, 39, 185, 0.3)",
          light: "rgba(129, 39, 185, 0.7)",
        },
        potblack: {
          DEFAULT: "#161616",
          light: "#1A1A1A",
          elevated: "#2A2A2A",
        },
        gold: {
          DEFAULT: "#FFD700",
          glow: "rgba(255, 215, 0, 0.3)",
        },
        gray: {
          light: "#AAAAAA",
          dark: "#666666",
        },
      },
      spacing: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-secondary': 'var(--shadow-glow-secondary)',
        'card': 'var(--shadow-card)',
        'cyan': '0 0 20px hsl(189 100% 50% / 0.3)',
        'cyan-lg': '0 0 40px hsl(189 100% 50% / 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-xp': 'var(--gradient-xp)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(189 100% 50% / 0.2)" },
          "50%": { boxShadow: "0 0 40px hsl(189 100% 50% / 0.4)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(255, 215, 0, 0.3)", borderColor: "#FFD700" },
          "50%": { boxShadow: "0 0 24px rgba(255, 215, 0, 0.5)", borderColor: "#FFD700" },
        },
        "pulse-emerald": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(53, 212, 117, 0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(53, 212, 117, 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "countdown": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(189 100% 50% / 0.2)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(189 100% 50% / 0.4)" 
          },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "focus-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(189 100% 50% / 0.4)" },
          "100%": { boxShadow: "0 0 0 4px hsl(189 100% 50% / 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2s infinite ease-in-out",
        "pulse-gold": "pulse-gold 1s infinite ease-in-out",
        "pulse-emerald": "pulse-emerald 2s infinite ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "countdown": "countdown 1s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "slide-in-bottom": "slide-in-bottom 0.4s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "focus-ring": "focus-ring 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;