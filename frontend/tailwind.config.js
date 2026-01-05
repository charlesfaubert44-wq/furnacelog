/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // FurnaceLog - Primary Palette
        furnace: {
          primary: '#C94A06',
          dark: '#A33D05',
          light: '#E55807',
          hover: '#9a3412',
        },

        // FurnaceLog - Background & Card Colors
        'fl-background': '#000000',
        'fl-card-bg': '#0a0a0a',
        'fl-card-border': '#1a1a1a',

        // FurnaceLog - Text Colors
        'fl-text': '#ffffff',
        'fl-text-muted': '#6b7280',
        'fl-text-secondary': '#9ca3af',

        // Territorial Homestead - Hearth & Home Palette
        // Foundation (Backgrounds)
        'deep-charcoal': '#1a1412',
        'rich-umber': '#2d1f1a',
        'warm-stone': '#3d3127',

        // Primary (Warmth & Action)
        'ember-glow': '#ff6b35',
        'hearth-fire': '#f7931e',
        'copper-warm': '#c87941',

        // Secondary (Comfort & Trust)
        'wool-cream': '#f4e8d8',
        'honey': '#d4a373',
        'terracotta': '#d4734e',

        // Functional
        'forest-green': '#6a994e',
        'sunset-amber': '#f2a541',
        'brick-red': '#d45d4e',
        'slate-blue': '#5b8fa3',

        // Accent (Seasonal)
        'winter-sky': '#c4d7e0',
        'northern-lights': '#7ea88f',
        'birch-white': '#ede4d3',

        // Legacy Boiler Room - Primary Palette (preserved for compatibility)
        graphite: {
          DEFAULT: '#1A1D23',
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#1A1D23',
        },
        steel: {
          DEFAULT: '#2C3440',
          50: '#F1F3F5',
          100: '#E3E7EB',
          200: '#C7CFD7',
          300: '#ABB7C3',
          400: '#8F9FAF',
          500: '#73879B',
          600: '#5D6E82',
          700: '#475669',
          800: '#2C3440',
          900: '#1F2631',
        },
        concrete: {
          DEFAULT: '#E8EAED',
          50: '#FFFFFF',
          100: '#FAFBFC',
          200: '#F5F6F8',
          300: '#F0F2F4',
          400: '#EBEDF0',
          500: '#E8EAED',
          600: '#D1D4D9',
          700: '#BABEC5',
          800: '#A3A8B1',
          900: '#8C929D',
        },
        iron: {
          DEFAULT: '#4A5568',
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        aluminum: {
          DEFAULT: '#94A3B8',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        frost: {
          DEFAULT: '#F8FAFC',
          white: '#FFFFFF',
        },

        // Heat & Function - Accent Palette
        'system-green': {
          DEFAULT: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        'tech-blue': {
          DEFAULT: '#0284C7',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        'indicator-purple': {
          DEFAULT: '#7C3AED',
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
        },
        'heat-orange': {
          DEFAULT: '#EA580C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        'flame-red': {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        'caution-yellow': {
          DEFAULT: '#EAB308',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        'emergency-red': {
          DEFAULT: '#B91C1C',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        'ice-blue': {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Using Tailwind's default sans-serif font stack
      // fontFamily configuration removed to use defaults
      fontSize: {
        // Desktop scale
        'display': ['48px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '500' }],
        'h4': ['16px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '500' }],
        'body': ['15px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'surface': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'floating': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'glow-aurora': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-warning': '0 0 20px rgba(234, 88, 12, 0.3)',
        'glow-critical': '0 0 20px rgba(239, 68, 68, 0.3)',
        // Territorial Homestead - Warm Glows
        'glow-sm': '0 4px 16px rgba(255, 107, 53, 0.3)',
        'glow-md': '0 6px 24px rgba(255, 107, 53, 0.45)',
        'glow-lg': '0 8px 32px rgba(255, 107, 53, 0.5)',
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #8B5CF6 100%)',
        'gradient-night': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        'gradient-frost': 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        // Territorial Homestead - Warm Gradients
        'gradient-hearth': 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
        'gradient-warm-bg': 'linear-gradient(180deg, #2d1f1a 0%, #1a1412 100%)',
        'gradient-ember-glow': 'radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'pulse-critical': {
          '0%, 100%': {
            borderColor: 'rgba(239, 68, 68, 1)',
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
          },
          '50%': {
            borderColor: 'rgba(239, 68, 68, 0.8)',
            boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(8px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-8px)', opacity: 0 },
        },
        'fade-slide-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
            borderColor: 'rgba(251, 191, 36, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
            borderColor: 'rgba(251, 191, 36, 0.8)',
          },
        },
        'success-flash': {
          '0%': { backgroundColor: 'rgba(16, 185, 129, 0)' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
          '100%': { backgroundColor: 'rgba(16, 185, 129, 0)' },
        },
        'check-scale': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'warm-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        'count-up': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'backdrop-blur-in': {
          '0%': { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(12, 10, 9, 0)' },
          '100%': { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(12, 10, 9, 0.95)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-critical': 'pulse-critical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-in': 'slide-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slide-up 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-slide-up': 'fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shake': 'shake 0.4s ease-in-out',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'success-flash': 'success-flash 1s ease-out',
        'check-scale': 'check-scale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 3s ease-in-out infinite',
        'flicker': 'flicker 2s ease-in-out infinite',
        'warm-shimmer': 'warm-shimmer 2s linear infinite',
        'progress-fill': 'progress-fill 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up': 'count-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'backdrop-blur-in': 'backdrop-blur-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
