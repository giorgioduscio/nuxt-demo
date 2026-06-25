// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
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
      // 'todos' è il nome del nostro storage nativo
      todos: {
        driver: 'fs',
        base: './.data/todos'
      }
    }
  }
})
