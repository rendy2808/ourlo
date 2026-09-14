<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL
const route = useRoute()
const signingOut = ref(false)

const { data } = await useFetch<{ admin: { email: string } }>(`${baseURL}api/admin/session`, {
  headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
})

async function signOut() {
  signingOut.value = true
  await $fetch(`${baseURL}api/admin/session`, { method: 'DELETE' })
  await navigateTo(`${baseURL}admin/login`)
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <NuxtLink class="admin-brand" to="/admin/events">ourlo<span>✳︎</span></NuxtLink>
      <p class="admin-kicker">PRIVATE STUDIO</p>
      <nav aria-label="Admin navigation">
        <NuxtLink to="/admin/events" :class="{ active: route.path.startsWith('/admin/events') }">
          <span>Events</span><span aria-hidden="true">↗︎</span>
        </NuxtLink>
      </nav>
      <div class="admin-account">
        <span>Signed in as</span><strong>{{ data?.admin.email }}</strong>
        <button :disabled="signingOut" @click="signOut">{{ signingOut ? 'Signing out…' : 'Sign out' }}</button>
      </div>
    </aside>
    <main class="admin-main"><slot /></main>
  </div>
</template>

<style>
.admin-shell{min-height:100vh;background:#f3eee5;color:#561d32;display:grid;grid-template-columns:250px 1fr}.admin-sidebar{position:sticky;top:0;height:100vh;padding:34px 28px 26px;background:#561d32;color:#fbf7ee;display:flex;flex-direction:column}.admin-brand{font-family:var(--serif);font-size:42px;letter-spacing:-3px}.admin-brand span{font-family:var(--sans);font-size:17px;margin-left:5px;vertical-align:top}.admin-kicker{font-size:10px;letter-spacing:2px;color:#eedc79;margin:8px 0 54px}.admin-sidebar nav a{display:flex;justify-content:space-between;padding:13px 14px;border-radius:10px;color:#f8f5edb3;font-size:14px}.admin-sidebar nav a.active{background:#ffffff12;color:#fff}.admin-account{margin-top:auto;padding-top:20px;border-top:1px solid #ffffff24;display:flex;flex-direction:column;gap:5px}.admin-account span{font-size:10px;letter-spacing:1px;color:#f8f5ed8c}.admin-account strong{font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis}.admin-account button{margin-top:12px;border:0;background:none;color:#eedc79;text-align:left;padding:0;font-size:12px}.admin-main{padding:54px clamp(28px,5vw,72px) 80px;min-width:0}.admin-page{max-width:1100px;margin:auto}.admin-page-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:38px}.admin-page-head .eyebrow{margin-bottom:10px}.admin-page-head h1{font-size:clamp(46px,5vw,70px)}.admin-primary{display:inline-flex;align-items:center;justify-content:center;gap:20px;padding:14px 20px;background:#561d32;color:#fff;border:1px solid #561d32;border-radius:50px;font-size:13px;font-weight:600}.admin-secondary{background:transparent;color:#561d32}.admin-panel{background:#fbf8f1;border:1px solid #ded4d2;border-radius:18px;box-shadow:0 15px 40px #561d320a}.admin-empty{text-align:center;padding:80px 25px}.admin-empty span{font-size:38px}.admin-empty h2{font-size:36px;margin:13px 0 7px}.admin-empty p{color:#756267;font-size:14px;margin-bottom:24px}@media(max-width:760px){.admin-shell{display:block}.admin-sidebar{position:relative;height:auto;padding:20px;display:grid;grid-template-columns:1fr auto;align-items:center}.admin-brand{font-size:35px}.admin-kicker,.admin-account span,.admin-account strong{display:none}.admin-sidebar nav{grid-column:1;margin-top:12px}.admin-sidebar nav a{padding-left:0}.admin-account{grid-column:2;grid-row:1;margin:0;padding:0;border:0}.admin-account button{margin:0}.admin-main{padding:35px 20px 60px}.admin-page-head{align-items:flex-start;flex-direction:column}.admin-page-head h1{font-size:48px}}
</style>
