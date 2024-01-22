const { purge } = require('tailwindcss/stubs/config.full.js');

const autoprefixer = require('autoprefixer')();
const tailwindcss = require('tailwindcss')('./tailwind.config.js');

module.exports = {
    plugins: [tailwindcss, autoprefixer],
    ...(process.env.NODE_ENV === 'production' ? [purge] : []),
};
