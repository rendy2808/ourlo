export default defineNuxtRouteMiddleware(async () => {
  const baseURL = useRuntimeConfig().app.baseURL
  try {
    await $fetch(`${baseURL}api/admin/session`, {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
    })
  } catch {
    return navigateTo(`${baseURL}admin/login`)
  }
})
