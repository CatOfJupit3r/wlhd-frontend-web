/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
        },
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontSize: {
                '4.5xl': 'font-size: 2.5rem; line-height: 3rem;', // t-giant
                '3.5xl': 'font-size: 2rem; line-height: 2.5rem;', // t-bigger
            },
            colors: {
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
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'spinner-border': {
                    to: { transform: 'rotate(360deg)' },
                },
                'spinner-grow': {
                    '0%': { transform: 'scale(0)' },
                    '50%': {
                        opacity: '1',
                        transform: 'none',
                    },
                },
                shaking: {
                    '0%': { transform: 'rotate(-3deg)', animationTimingFunction: 'ease-in' },
                    '25%': { transform: 'rotate(0deg)', animationTimingFunction: 'ease-in' },
                    '50%': { transform: 'rotate(3deg)', animationTimingFunction: 'ease-out' },
                    '75%': { transform: 'rotate(0deg)', animationTimingFunction: 'ease-out' },
                    '100%': { transform: 'rotate(-3deg)', animationTimingFunction: 'ease-in' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'spinner-border': 'spinner-border 0.75s linear infinite',
                'spinner-grow': 'spinner-grow 0.75s linear infinite',
                shaking: 'shaking 0.5s linear infinite',
            },
        },
    },
    // eslint-disable-next-line no-undef,@typescript-eslint/no-require-imports
    plugins: [require('tailwindcss-animate')],
};
