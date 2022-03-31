import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  build: {
    target: 'esnext'
  }
}

