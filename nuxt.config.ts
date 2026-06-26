// configurazione del progetto (nitro, vite, css, etc.)
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/style.sass'
  ],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  nitro: {
    storage: {
      todos: {
        driver: 'fs',
        base: './.data/todos'
      },
      cv: {
        driver: 'fs',
        base: './.data/cv'
      },
    }
  }
})
