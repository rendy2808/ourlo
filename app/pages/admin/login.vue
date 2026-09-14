<script setup lang="ts">
definePageMeta({ layout: false })
const baseURL = useRuntimeConfig().app.baseURL
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const submitting = ref(false)

useHead({ title: 'Studio sign in — Ourlo' })

async function signIn() {
  errorMessage.value = ''
  submitting.value = true
  try {
    await $fetch(`${baseURL}api/admin/session`, {
      method: 'POST', body: { email: email.value, password: password.value }
    })
    await navigateTo(`${baseURL}admin/events`)
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'We could not sign you in.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-note">
      <NuxtLink class="login-brand" to="/">ourlo<span>✳︎</span></NuxtLink>
      <div><p class="eyebrow">YOUR PRIVATE STUDIO</p><h1>Make the day.<br><em>Keep the feeling.</em></h1><p>Events, guest passes, and every little keepsake—all in one quiet place.</p></div>
      <span class="login-script">this moment is ours.</span>
    </section>
    <section class="login-form-wrap">
      <form class="login-form" @submit.prevent="signIn">
        <p class="eyebrow">WELCOME BACK</p><h2>Come on in.</h2><p class="login-intro">Sign in to manage your Ourlo events.</p>
        <label>Email address<input v-model="email" type="email" autocomplete="username" required autofocus placeholder="you@example.com"></label>
        <label>Password<input v-model="password" type="password" autocomplete="current-password" minlength="8" maxlength="256" required placeholder="Your password"></label>
        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <button class="admin-primary" type="submit" :disabled="submitting">{{ submitting ? 'Opening studio…' : 'Open the studio' }} <span aria-hidden="true">↗︎</span></button>
        <p class="login-help">Local development account. Credentials never ship with the website.</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page{min-height:100vh;display:grid;grid-template-columns:1.05fr .95fr;background:#f8f5ed}.login-note{min-height:100vh;padding:42px clamp(32px,6vw,90px);background:#561d32;color:#f8f5ed;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}.login-note::after{content:'✳︎';position:absolute;right:-80px;bottom:-100px;font-size:430px;color:#ffffff08;transform:rotate(12deg)}.login-brand{font-family:var(--serif);font-size:50px;letter-spacing:-4px}.login-brand span{font-family:var(--sans);font-size:20px;margin-left:6px;vertical-align:top}.login-note .eyebrow{color:#eedc79;margin-bottom:20px}.login-note h1{font-size:clamp(64px,7vw,98px);line-height:.98}.login-note div>p:last-child{max-width:420px;color:#f8f5edb5;margin-top:25px}.login-script{font-family:'Caveat',cursive;font-size:27px;position:relative;z-index:1}.login-form-wrap{display:grid;place-items:center;padding:40px}.login-form{width:min(430px,100%)}.login-form h2{font-size:58px;margin:8px 0}.login-intro{color:#756267;margin-bottom:32px}.login-form label{display:grid;gap:8px;font-size:12px;font-weight:600;margin-top:18px}.login-form input{width:100%;height:54px;border:1px solid #d9cfd0;border-radius:9px;background:#fffdf8;padding:0 16px;color:#561d32;font:inherit}.login-form input:focus{outline:2px solid #af6339;outline-offset:2px}.login-form .admin-primary{width:100%;margin-top:24px;height:54px}.login-form button:disabled{opacity:.6;cursor:wait}.form-error{background:#f2dedd;color:#7b2029;padding:11px 13px;border-radius:8px;font-size:13px;margin-top:17px}.login-help{font-size:11px;color:#756267;text-align:center;margin-top:16px}@media(max-width:800px){.login-page{grid-template-columns:1fr}.login-note{min-height:360px;padding:30px}.login-note h1{font-size:60px}.login-note div>p:last-child,.login-script{display:none}.login-form-wrap{padding:50px 24px 70px}}
</style>
