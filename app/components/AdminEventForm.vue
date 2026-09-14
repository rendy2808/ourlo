<script setup lang="ts">
type EventForm = {
  name: string; slug: string; eventType: string; eventDate: string
  activeFrom: string; activeUntil: string; timezone: string; guestCount: number
  maxPhotosPerPass: number; maxAiPerPass: number; status: string
}

const props = defineProps<{ initial?: Partial<EventForm>; submitLabel?: string; busy?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [value: EventForm] }>()
const slugTouched = ref(Boolean(props.initial?.slug))
const form = reactive<EventForm>({
  name: '', slug: '', eventType: 'wedding', eventDate: '', activeFrom: '', activeUntil: '',
  timezone: 'Asia/Jakarta', guestCount: 100, maxPhotosPerPass: 10, maxAiPerPass: 0,
  status: 'draft', ...props.initial
})

watch(() => props.initial, (value) => Object.assign(form, value || {}), { deep: true })
watch(() => form.name, (name) => {
  if (!slugTouched.value) form.slug = makeSlug(name)
})
watch(() => form.eventDate, (date) => {
  if (!date) return
  if (!form.activeFrom) form.activeFrom = `${date}T00:00`
  if (!form.activeUntil) form.activeUntil = `${date}T23:59`
})

function makeSlug(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}
</script>

<template>
  <form class="event-form admin-panel" @submit.prevent="emit('submit', { ...form })">
    <section>
      <div class="form-section-title"><span>01</span><div><h2>The occasion</h2><p>The details guests will recognize when they open their pass.</p></div></div>
      <div class="form-grid two">
        <label class="wide">Event name<input v-model.trim="form.name" required minlength="2" maxlength="100" placeholder="Maya & Rafi"></label>
        <label>Event type<select v-model="form.eventType"><option value="wedding">Wedding</option><option value="engagement">Engagement</option><option value="tennis">Tennis</option><option value="other">Other</option></select></label>
        <label>Event date<input v-model="form.eventDate" type="date" required></label>
        <label class="wide">Guest URL<div class="slug-field"><span>/e/</span><input v-model.trim="form.slug" required maxlength="80" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="maya-rafi" @input="slugTouched = true"></div><small>Lowercase letters, numbers, and hyphens.</small></label>
      </div>
    </section>
    <section>
      <div class="form-section-title"><span>02</span><div><h2>When it opens</h2><p>Set the local event window. You can change this before the day.</p></div></div>
      <div class="form-grid three">
        <label>Starts<input v-model="form.activeFrom" type="datetime-local" required></label>
        <label>Ends<input v-model="form.activeUntil" type="datetime-local" required></label>
        <label>Timezone<select v-model="form.timezone"><option value="Asia/Jakarta">WIB · Jakarta</option><option value="Asia/Makassar">WITA · Makassar</option><option value="Asia/Jayapura">WIT · Jayapura</option></select></label>
      </div>
    </section>
    <section>
      <div class="form-section-title"><span>03</span><div><h2>Guest allowances</h2><p>These become the default quotas for passes generated later.</p></div></div>
      <div class="form-grid three">
        <label>Guest passes<input v-model.number="form.guestCount" type="number" min="1" max="10000" required></label>
        <label>Photos per pass<input v-model.number="form.maxPhotosPerPass" type="number" min="0" max="100" required></label>
        <label>AI edits per pass<input v-model.number="form.maxAiPerPass" type="number" min="0" :max="form.maxPhotosPerPass" required></label>
      </div>
    </section>
    <section>
      <div class="form-section-title"><span>04</span><div><h2>Event status</h2><p>Keep new events as drafts until their setup is complete.</p></div></div>
      <label class="status-field">Status<select v-model="form.status"><option value="draft">Draft</option><option value="ready">Ready</option><option value="active">Active</option><option value="ended">Ended</option><option value="archived">Archived</option></select></label>
    </section>
    <footer>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <button class="admin-primary" type="submit" :disabled="busy">{{ busy ? 'Saving…' : (submitLabel || 'Save event') }} <span aria-hidden="true">↗︎</span></button>
    </footer>
  </form>
</template>

<style scoped>
.event-form{overflow:hidden}.event-form section{padding:30px 34px;border-bottom:1px solid #ded4d2}.form-section-title{display:grid;grid-template-columns:34px 1fr;gap:12px;margin-bottom:25px}.form-section-title>span{font-family:var(--serif);font-style:italic;font-size:17px;padding-top:2px}.form-section-title h2{font-family:var(--sans);font-size:17px;font-weight:600;letter-spacing:0}.form-section-title p{font-size:12px;color:#756267;margin-top:3px}.form-grid{display:grid;gap:18px}.form-grid.two{grid-template-columns:1fr 1fr}.form-grid.three{grid-template-columns:1fr 1fr 1fr}.form-grid .wide{grid-column:1/-1}.event-form label{display:grid;gap:8px;font-size:11px;font-weight:700;letter-spacing:.3px}.event-form input,.event-form select{width:100%;height:49px;border:1px solid #d9cfd0;border-radius:8px;background:#fffdf8;color:#561d32;padding:0 13px;font:inherit;font-size:14px}.event-form input:focus,.event-form select:focus{outline:2px solid #af6339;outline-offset:2px}.event-form small{font-size:10px;color:#756267;font-weight:400}.slug-field{display:flex;align-items:center;border:1px solid #d9cfd0;border-radius:8px;background:#f3eee5;overflow:hidden}.slug-field span{padding:0 11px;color:#756267;font-weight:500}.slug-field input{border:0;border-left:1px solid #d9cfd0;border-radius:0}.status-field{max-width:280px}.event-form footer{padding:24px 34px;display:flex;justify-content:flex-end;align-items:center;gap:20px}.event-form button:disabled{opacity:.6;cursor:wait}.form-error{color:#8c2632;background:#f2dedd;border-radius:7px;padding:9px 12px;font-size:12px;margin-right:auto}@media(max-width:700px){.event-form section{padding:25px 20px}.form-grid.two,.form-grid.three{grid-template-columns:1fr}.form-grid .wide{grid-column:auto}.event-form footer{padding:20px;align-items:stretch;flex-direction:column}.event-form footer button{width:100%}}
</style>
