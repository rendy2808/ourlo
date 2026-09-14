<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'New event — Ourlo Studio' })
const baseURL = useRuntimeConfig().app.baseURL
const busy = ref(false)
const errorMessage = ref('')

async function createEvent(form: any) {
  busy.value = true
  errorMessage.value = ''
  try {
    const result = await $fetch<{ event: { id: string } }>(`${baseURL}api/admin/events`, { method: 'POST', body: form })
    await navigateTo(`/admin/events/${result.event.id}`)
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'The event could not be saved.'
  } finally { busy.value = false }
}
</script>

<template><div class="admin-page"><header class="admin-page-head"><div><p class="eyebrow">A NEW MOMENT</p><h1>Create an event.</h1></div><NuxtLink class="admin-primary admin-secondary" to="/admin/events">Back to events</NuxtLink></header><AdminEventForm submit-label="Create event" :busy="busy" :error="errorMessage" @submit="createEvent" /></div></template>
