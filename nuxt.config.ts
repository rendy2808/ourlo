export default defineNuxtConfig({
  compatibilityDate: '2026-09-13',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
    title: 'Ourlo — This moment is ours.',
    meta: [{ name: 'description', content: 'A little photobox magic, on your own phone. Create personal photo keepsakes at weddings, match days, and everything worth getting together for.' }, { name: 'theme-color', content: '#561d32' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${process.env.NUXT_APP_BASE_URL || '/'}favicon.svg` }, { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap' }]
    }
  },
  nitro: { prerender: { routes: ['/', '/demo'] } }
})
