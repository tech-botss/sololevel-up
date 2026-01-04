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
        display: ['Rajdhani', 'Nova Square', 'sans-serif'],
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        accent: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      fontSize: {
        'h1': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
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
        // Solo Leveling Theme Colors
        cyan: {
          DEFAULT: "#00D9FF",
          light: "#66E8FF",
          dark: "#00A3BF",
          glow: "rgba(0, 217, 255, 0.4)",
        },
        neon: {
          blue: "#00D9FF",
          green: "#00FF88",
          purple: "#8855FF",
        },
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
        'glow-accent': 'var(--shadow-glow-accent)',
        'card': 'var(--shadow-card)',
        'neon': '0 0 20px currentColor, 0 0 40px currentColor',
        'neon-sm': '0 0 10px currentColor',
        'neon-lg': '0 0 30px currentColor, 0 0 60px currentColor',
        'cyan': '0 0 20px hsl(189 100% 50% / 0.4)',
        'cyan-lg': '0 0 40px hsl(189 100% 50% / 0.5), 0 0 80px hsl(189 100% 50% / 0.3)',
        'cyan-inset': 'inset 0 0 30px hsl(189 100% 50% / 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-xp': 'var(--gradient-xp)',
        'gradient-metallic': 'var(--gradient-metallic)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(189 100% 50% / 0.2), 0 0 40px hsl(189 100% 50% / 0.1)" 
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(189 100% 50% / 0.4), 0 0 80px hsl(189 100% 50% / 0.2)" 
          },
        },
        "pulse-cyan": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 hsl(189 100% 50% / 0.4)",
            borderColor: "hsl(189 100% 50% / 0.5)"
          },
          "50%": { 
            boxShadow: "0 0 30px hsl(189 100% 50% / 0.3)",
            borderColor: "hsl(189 100% 50% / 0.8)"
          },
        },
        "pulse-accent": {
          "0%, 100%": { 
            boxShadow: "0 0 15px hsl(156 100% 50% / 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 30px hsl(156 100% 50% / 0.5)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(189 100% 50% / 0.3), inset 0 0 20px hsl(189 100% 50% / 0.05)" 
          },
          "50%": { 
            boxShadow: "0 0 50px hsl(189 100% 50% / 0.5), inset 0 0 30px hsl(189 100% 50% / 0.1)" 
          },
        },
        "text-glow": {
          "0%, 100%": { 
            textShadow: "0 0 10px hsl(189 100% 50% / 0.5)" 
          },
          "50%": { 
            textShadow: "0 0 20px hsl(189 100% 50% / 0.8), 0 0 40px hsl(189 100% 50% / 0.4)" 
          },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2s infinite ease-in-out",
        "pulse-cyan": "pulse-cyan 2s infinite ease-in-out",
        "pulse-accent": "pulse-accent 2s infinite ease-in-out",
        "float": "float 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "border-flow": "border-flow 3s ease infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 10s linear infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "scan-line": "scan-line 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
