<script setup lang="ts">
const ACCESS_KEY = 'ourlo-preview-access'
const ACCESS_CODE_HASH = '862b4ea8c54fb30e7cc7f56e6b21967db674ce14e7b1c01c9efd960004f5a13a'
const checked = ref(false)
const accessGranted = ref(false)

async function hashAccessCode(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await window.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

async function requestAccess() {
  const code = window.prompt('Enter the Ourlo preview passcode')
  if (code !== null && await hashAccessCode(code) === ACCESS_CODE_HASH) {
    window.sessionStorage.setItem(ACCESS_KEY, 'granted')
    accessGranted.value = true
    return
  }
  if (code !== null) window.alert('That passcode is not correct.')
}

onMounted(() => {
  accessGranted.value = window.sessionStorage.getItem(ACCESS_KEY) === 'granted'
  checked.value = true
  if (!accessGranted.value) window.setTimeout(requestAccess, 80)
})
</script>

<template>
  <NuxtLayout v-if="accessGranted"><NuxtPage /></NuxtLayout>
  <main v-else-if="checked" class="access-screen">
    <div class="access-card">
      <span class="access-mark" aria-hidden="true">✳︎</span>
      <p>PRIVATE PREVIEW</p>
      <h1>A little moment<br><em>behind the curtain.</em></h1>
      <p>This Ourlo preview is shared with invited viewers.</p>
      <button type="button" @click="requestAccess">Enter passcode <span aria-hidden="true">↗︎</span></button>
    </div>
  </main>
</template>

<style scoped>
.access-screen{min-height:100vh;display:grid;place-items:center;padding:28px;background:#f2e9df;color:#561d32;background-image:radial-gradient(#561d3212 1px,transparent 1px);background-size:22px 22px}.access-card{width:min(520px,100%);text-align:center;background:#faf7ef;border:1px solid #561d3233;border-radius:180px 180px 24px 24px;padding:58px 42px 42px;box-shadow:0 24px 70px #561d3219}.access-mark{display:block;font-size:42px;margin-bottom:18px}.access-card>p:first-of-type{font-size:11px;font-weight:700;letter-spacing:1.8px}.access-card h1{font-family:var(--serif);font-size:clamp(45px,7vw,65px);font-weight:400;line-height:1.02;letter-spacing:-2px;margin:17px 0 20px}.access-card h1 em{font-weight:400}.access-card>p:last-of-type{color:#76666b;font-size:15px}.access-card button{width:min(290px,100%);height:54px;margin-top:27px;padding:0 20px;display:inline-flex;justify-content:space-between;align-items:center;border:1px solid #561d32;border-radius:30px;background:#561d32;color:#faf7ef;font-weight:600}.access-card button span{font-size:18px}@media(max-width:520px){.access-card{padding:48px 24px 32px;border-radius:130px 130px 20px 20px}.access-card h1{font-size:47px}}
</style>
