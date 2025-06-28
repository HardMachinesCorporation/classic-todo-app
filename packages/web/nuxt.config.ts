// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  alias:{
    '@shared': resolve(__dirname, '../shared/src'),
    '@api': resolve(__dirname, '../api/src'),
    '@web': resolve(__dirname, './src')
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
