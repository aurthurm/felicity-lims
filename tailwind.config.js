const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    // Enable class-based dark mode
    darkMode: 'class',
    // Configure paths to all template files
    content: ['./webapp/**/*.{html,js.jsx,ts,tsx,vue}', './public/**/*.html', './index.html'],
    // Optional: Add a prefix to utility classes (e.g., 'tw-')
    prefix: '',
    // Optional: Mark utilities as !important
    important: false,
    // Optional: Change the separator character (default is ':')
    separator: ':',
    safelist: [
        'dark', // Default dark theme
        'black-and-white',
        'sterile',
        'clinical-blue',
        'emergency-red',
        'sterile-green',
        'warm-neutral',
        'cool-slate',
        'corporate-navy',
    ],
    plugins: [
        // Enable Tailwind Forms plugin with class strategy
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        // Enable Tailwind Typography plugin
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            // Custom grid templates if needed
            gridTemplateColumns: {
                dashboard: '150px minmax(350px, 1fr)',
            },
            // Extend the default color palette
            colors: {
                // Map CSS variables to Tailwind color names
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
                success: 'hsl(var(--success))',
                'success-foreground': 'hsl(var(--success-foreground))',
                // Added warning colors
                warning: 'hsl(var(--warning))',
                'warning-foreground': 'hsl(var(--warning-foreground))',
                // Added info colors
                info: 'hsl(var(--info))',
                'info-foreground': 'hsl(var(--info-foreground))',
                // Border, input, and ring colors
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))', // Often used for form input borders
                ring: 'hsl(var(--ring))',   // Used for focus rings
            },
            // Extend border radius
            borderRadius: {
                // Map the 'lg' border radius utility to use the CSS variable
                // You could also map 'DEFAULT' or 'md' if preferred:
                // DEFAULT: 'var(--radius)',
                // md: 'var(--radius)',
                lg: 'var(--radius)',
            },
        },
    },
};