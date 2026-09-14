<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const baseURL = useRuntimeConfig().app.baseURL
const route = useRoute()
const busy = ref(false)
const saved = ref(false)
const errorMessage = ref('')

const { data } = await useFetch<{ event: any }>(`${baseURL}api/admin/events/${route.params.id}`, {
  headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
})
if (!data.value?.event) throw createError({ statusCode: 404, statusMessage: 'Event not found.' })
useHead({ title: () => `${data.value?.event.name || 'Event'} — Ourlo Studio` })

async function saveEvent(form: any) {
  busy.value = true; saved.value = false; errorMessage.value = ''
  try {
    const result = await $fetch<{ event: any }>(`${baseURL}api/admin/events/${route.params.id}`, { method: 'PUT', body: form })
    data.value = result
    saved.value = true
    window.setTimeout(() => { saved.value = false }, 2500)
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'The changes could not be saved.'
  } finally { busy.value = false }
}
</script>

<template><div class="admin-page"><header class="admin-page-head"><div><p class="eyebrow">EVENT SETTINGS <span v-if="saved" class="saved-note">· SAVED</span></p><h1>{{ data?.event.name }}</h1></div><NuxtLink class="admin-primary admin-secondary" to="/admin/events">Back to events</NuxtLink></header><AdminEventForm :initial="data?.event" submit-label="Save changes" :busy="busy" :error="errorMessage" @submit="saveEvent" /></div></template>

<style scoped>.saved-note{color:#527348}</style>
