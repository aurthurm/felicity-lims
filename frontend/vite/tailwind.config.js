const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,ts,vue}',
    './public/**/*.html',
    './index.html',
  ],
  prefix: '',
  important: false,
  separator: ':',
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'dashboard': '150px minmax(350px, 1fr)',
      },
      colors: {
        amber: colors.amber,
        black: colors.black,
        sky: colors.sky,
      },
    },
  }
}
