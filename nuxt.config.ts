// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-10',

  devtools: { enabled: true },

  runtimeConfig: {
    // Private keys (server-side only)
    unsplashSecretKey: '',

    // Public keys (exposed to client)
    public: {
      unsplashAccessKey: '',
      unsplashOauthEnabled: false,
      unsplashRedirectUri: '',
      appDummyMode: true,
    }
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Pagebuilder Tools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A collection of reusable UI components for building simple pages' }
      ],
    }
  },
})
