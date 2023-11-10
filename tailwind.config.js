const colors = require('tailwindcss/colors');

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
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                dashboard: '150px minmax(350px, 1fr)',
            },
            colors: {
                amber: colors.amber,
                black: colors.black,
                sky: colors.sky,
            },
        },
    },
};
