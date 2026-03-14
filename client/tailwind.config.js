/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                heading: ['DM Serif Display', 'Georgia', 'serif'],
            },
            colors: {
                // Dark theme surface colors
                surface: {
                    DEFAULT: '#09090b',
                    50: '#18181b',
                    100: '#1e1e22',
                    200: '#27272a',
                    300: '#303036',
                    400: '#3f3f46',
                },
                // Neutral text/border shades for dark theme
                gray: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                // Vibrant accent — cyan-to-violet spectrum
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                accent: {
                    cyan: '#22d3ee',
                    blue: '#3b82f6',
                    violet: '#8b5cf6',
                    purple: '#a855f7',
                    pink: '#ec4899',
                },
                success: {
                    light: '#132e1b',
                    DEFAULT: '#22c55e',
                    dark: '#16a34a',
                },
                warning: {
                    light: '#332b0e',
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                error: {
                    light: '#331111',
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'xs': '0 1px 2px rgba(0, 0, 0, 0.3)',
                'sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
                'md': '0 4px 16px rgba(0, 0, 0, 0.4)',
                'lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
                'xl': '0 16px 48px rgba(0, 0, 0, 0.6)',
                '2xl': '0 24px 64px rgba(0, 0, 0, 0.7)',
                'glow-sm': '0 0 15px rgba(59, 130, 246, 0.15)',
                'glow-md': '0 0 30px rgba(59, 130, 246, 0.2)',
                'glow-lg': '0 0 60px rgba(59, 130, 246, 0.25)',
                'glow-accent': '0 0 40px rgba(139, 92, 246, 0.2)',
                'glow-success': '0 0 30px rgba(34, 197, 94, 0.2)',
                'glow-error': '0 0 30px rgba(239, 68, 68, 0.2)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-down': 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pulse-slow': 'pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 8s ease-in-out infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(2deg)' },
                },
                glowPulse: {
                    '0%, 100%': { opacity: '0.3', filter: 'blur(20px)' },
                    '50%': { opacity: '0.6', filter: 'blur(40px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            transitionTimingFunction: {
                'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                'spring': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
                'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            backdropBlur: {
                'xs': '2px',
                'xl': '24px',
                '2xl': '48px',
                '3xl': '72px',
            },
        },
    },
    plugins: [],
}
