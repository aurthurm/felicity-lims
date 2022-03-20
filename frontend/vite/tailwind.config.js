const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './index.html',
    './public/**/*.html',
    './src/**/*.vue',
  ],
  prefix: '',
  important: false,
  separator: ':',
  corePlugins: {},
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
      },
    },
  }
}
