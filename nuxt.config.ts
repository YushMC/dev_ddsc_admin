// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image"],
  css: ["~/assets/css/main.css", "~/assets/css/class.css"],
  ui: {
    colorMode: true,
  },
  runtimeConfig: {
    API_URL: "https://api.dokidokispanish.club",
    public: {
      api_url: "https://api.dokidokispanish.club",
    },
  },
  routeRules: {
    "/": { ssr: false },
    "/login": { ssr: false },
  },
});
