export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'YohannPeltier_7_01102021',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/image'],

  // Server Middleware
  serverMiddleware: [
    // API endpoint
    { path: '/api', handler: '~/api' },
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxt/image',
  ],

  image: {
    dir: '',
    screens: {
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
    presets: {
      profileMessage: {
        modifiers: {
          fit: 'cover',
          width: 43,
          height: 43,
        },
      },
      profile: {
        modifiers: {
          fit: 'cover',
          width: 150,
          height: 150,
        },
      },
      message: {
        modifiers: {
          fit: 'cover',
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000/api',
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer',
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: 'users/login', method: 'post' },
          user: { url: 'users/me', method: 'get', propertyName: '' },
          logout: false,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
