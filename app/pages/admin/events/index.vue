<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Events — Ourlo Studio' })
const baseURL = useRuntimeConfig().app.baseURL
const deletingId = ref('')

const { data, refresh, status } = await useFetch<{ events: any[] }>(`${baseURL}api/admin/events`, {
  headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
})

function readableDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

async function removeEvent(item: any) {
  if (!window.confirm(`Delete ${item.name}? This also removes its guest passes and photos.`)) return
  deletingId.value = item.id
  try {
    await $fetch(`${baseURL}api/admin/events/${item.id}`, { method: 'DELETE' })
    await refresh()
  } finally {
    deletingId.value = ''
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="admin-page-head"><div><p class="eyebrow">THE CONTROL ROOM</p><h1>Your events.</h1></div><NuxtLink class="admin-primary" to="/admin/events/new">New event <span aria-hidden="true">+</span></NuxtLink></header>
    <div v-if="status === 'pending'" class="admin-panel admin-empty"><p>Gathering your events…</p></div>
    <div v-else-if="!data?.events.length" class="admin-panel admin-empty"><span aria-hidden="true">✳︎</span><h2>Your first moment starts here.</h2><p>Create an event, set its allowances, then prepare the guest passes.</p><NuxtLink class="admin-primary" to="/admin/events/new">Create an event <span aria-hidden="true">↗︎</span></NuxtLink></div>
    <div v-else class="event-list">
      <article v-for="item in data.events" :key="item.id" class="event-card admin-panel">
        <div class="event-date"><strong>{{ new Date(`${item.eventDate}T00:00:00`).getDate() }}</strong><span>{{ new Date(`${item.eventDate}T00:00:00`).toLocaleString('en', { month: 'short' }).toUpperCase() }}</span></div>
        <div class="event-main"><div class="event-title"><span class="status-pill" :class="item.status">{{ item.status }}</span><span>{{ item.eventType }}</span></div><h2>{{ item.name }}</h2><p>{{ readableDate(item.eventDate) }} · {{ item.timezone.replace('Asia/', '') }}</p></div>
        <div class="event-stats"><span><strong>{{ item.guestCount }}</strong> passes</span><span><strong>{{ item.maxPhotosPerPass }}</strong> photos each</span><span><strong>{{ item.maxAiPerPass }}</strong> AI edits</span></div>
        <div class="event-actions"><NuxtLink :to="`/admin/events/${item.id}`">Edit <span aria-hidden="true">↗︎</span></NuxtLink><button :disabled="deletingId === item.id" @click="removeEvent(item)">{{ deletingId === item.id ? 'Deleting…' : 'Delete' }}</button></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.event-list{display:grid;gap:14px}.event-card{display:grid;grid-template-columns:74px minmax(180px,1fr) auto auto;gap:26px;align-items:center;padding:23px 25px}.event-date{height:70px;border:1px solid #d9cfd0;border-radius:10px;display:grid;place-items:center;align-content:center;background:#f3eee5}.event-date strong{font-family:var(--serif);font-size:29px;line-height:1}.event-date span{font-size:9px;font-weight:700;letter-spacing:1px;margin-top:4px}.event-title{display:flex;gap:9px;align-items:center;text-transform:uppercase;font-size:9px;font-weight:700;letter-spacing:1px;color:#756267}.status-pill{padding:5px 8px;border-radius:20px;background:#e6ddd4;color:#6c5b5b}.status-pill.ready,.status-pill.active{background:#dce7d7;color:#35552e}.status-pill.ended,.status-pill.archived{background:#dedde2;color:#54505c}.event-main h2{font-size:27px;margin:7px 0 1px}.event-main p{font-size:11px;color:#756267}.event-stats{display:flex;gap:22px}.event-stats span{font-size:10px;color:#756267;white-space:nowrap}.event-stats strong{display:block;font-family:var(--serif);font-size:22px;font-weight:400;color:#561d32}.event-actions{display:flex;flex-direction:column;align-items:flex-end;gap:8px}.event-actions a,.event-actions button{font-size:11px;font-weight:700}.event-actions a{padding:9px 13px;border-radius:20px;background:#561d32;color:#fff}.event-actions button{border:0;background:none;color:#8c5863;padding:3px}.event-actions button:disabled{opacity:.5}@media(max-width:1050px){.event-card{grid-template-columns:74px 1fr auto}.event-stats{grid-column:2}.event-actions{grid-column:3;grid-row:1/3}.event-stats strong{display:inline;font-family:var(--sans);font-size:11px;font-weight:700}}@media(max-width:650px){.event-card{grid-template-columns:62px 1fr;gap:17px;padding:18px}.event-date{height:62px}.event-stats{grid-column:1/-1;justify-content:space-between;border-top:1px solid #ded4d2;padding-top:15px}.event-actions{grid-column:1/-1;grid-row:auto;flex-direction:row;justify-content:flex-end;align-items:center}.event-actions a{order:2}}
</style>
