const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./webapp/**/*.{html,js.jsx,ts,tsx,vue}', './public/**/*.html', './index.html'],
    prefix: '',
    important: false,
    separator: ':',
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'base', // only generate global styles
            strategy: 'class', // only generate classes
        }),
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                dashboard: '150px minmax(350px, 1fr)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: 'hsl(var(--card))',
                'card-foreground': 'hsl(var(--card-foreground))',
                popover: 'hsl(var(--popover))',
                'popover-foreground': 'hsl(var(--popover-foreground))',
                primary: 'hsl(var(--primary))',
                'primary-foreground': 'hsl(var(--primary-foreground))',
                secondary: 'hsl(var(--secondary))',
                'secondary-foreground': 'hsl(var(--secondary-foreground))',
                muted: 'hsl(var(--muted))',
                'muted-foreground': 'hsl(var(--muted-foreground))',
                accent: 'hsl(var(--accent))',
                'accent-foreground': 'hsl(var(--accent-foreground))',
                destructive: 'hsl(var(--destructive))',
                'destructive-foreground': 'hsl(var(--destructive-foreground))',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                success: 'hsl(var(--success))',
                'success-foreground': 'hsl(var(--success-foreground))',
            },
            borderRadius: {
                lg: 'var(--radius)',
            },
        },
    },
};
