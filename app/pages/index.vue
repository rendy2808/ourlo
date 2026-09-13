<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL
const imagePath = (file: string) => `${baseURL}images/${file}`
const menuOpen = ref(false)
const selectedLayout = ref('strip')
const selectedStyle = ref('original')
const layouts = [{ id: 'strip', name: 'The photo strip' }, { id: 'polaroid', name: 'The polaroid' }, { id: 'square', name: 'The square' }]
const styles = [{ id: 'original', name: 'Original' }, { id: 'film', name: 'Warm film' }, { id: 'mono', name: 'Black & white' }]
const faqs = [
  { q: 'Do guests need to download an app?', a: 'No download, no guest account. Scan your event QR code and Ourlo opens in your phone’s browser. Take a new photo or choose one you already love.' },
  { q: 'Is it just for weddings?', a: 'Weddings, engagements, tennis match days, or a good excuse to bring your people together. Your event gets its own frames, styles, and photo allowance.' },
  { q: 'Can we make it feel like our event?', a: 'Absolutely. Your event can have its own frame artwork, names, date, and selection of layouts and styles. Everything is set up for you before guests arrive.' },
  { q: 'Where do the finished photos go?', a: 'Guests can download and share their own keepsakes. Finished photos are also collected for the organizer in a private Google Drive folder. A guest gallery is optional.' },
  { q: 'When can I use Ourlo for my event?', a: 'Ourlo is in the making. This is a first look at the experience; event bookings and the live photobox are not open yet.' }
]
</script>

<template>
  <div>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="header">
      <NuxtLink class="wordmark" to="/" aria-label="Ourlo home">ourlo<span class="logo-dot">✳</span></NuxtLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a><a href="#your-kind-of-moment">For your moments</a><a href="#questions">A few questions</a>
      </nav>
      <NuxtLink class="button button-small header-cta" to="/demo">Try the guest demo <span aria-hidden="true">↗</span></NuxtLink>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-controls="mobile-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Close' : 'Menu' }}</button>
      <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
        <a href="#how-it-works" @click="menuOpen = false">How it works</a><a href="#your-kind-of-moment" @click="menuOpen = false">For your moments</a><a href="#questions" @click="menuOpen = false">A few questions</a><NuxtLink to="/demo" @click="menuOpen = false">Try the guest demo ↗</NuxtLink>
      </nav>
    </header>

    <main id="main">
      <section class="hero section-wrap">
        <div class="hero-copy">
          <p class="eyebrow"><span class="mini-flower" aria-hidden="true">✳</span> GOOD COMPANY. GREAT KEEPSAKES.</p>
          <h1>The best part?<br>You were <em>there.</em></h1>
          <p class="hero-description">The big day. The little in-between. Turn it all into photo keepsakes, with a photobox that’s already in your pocket.</p>
          <NuxtLink class="button button-main" to="/demo">Try the guest demo <span aria-hidden="true">↗</span></NuxtLink>
          <p class="hero-note">Your phone. Your people. No app needed.</p>
        </div>
        <div class="hero-art" aria-label="Photo keepsakes from a wedding and a day on the tennis court">
          <div class="keepsake keepsake-main">
            <img :src="imagePath('wedding-v2.png')" alt="A bride and male wedding guest caught in a joyful laugh at an evening reception" fetchpriority="high" width="1122" height="1402">
            <div class="keepsake-caption"><span>one for the memory box.</span><span class="small-heart" aria-hidden="true">♡</span></div>
          </div>
          <div class="hero-strip" aria-hidden="true">
            <img :src="imagePath('tennis-v2.png')" alt="" width="1448" height="1086"><img :src="imagePath('tennis-v2.png')" alt="" width="1448" height="1086"><img :src="imagePath('tennis-v2.png')" alt="" width="1448" height="1086">
            <span>MATCH POINT. GOOD PEOPLE.</span><b>ourlo</b>
          </div>
          <div class="round-note">less posing.<br><em>more living.</em><span aria-hidden="true">✳</span></div>
          <span class="handwritten hero-scribble">a little piece of being there</span>
        </div>
      </section>

      <div class="manifesto-band"><span>Made for the “one more photo” people.</span><span aria-hidden="true">✳</span><span>THIS MOMENT IS OURS.</span><span aria-hidden="true">✳</span><span>A good time, worth keeping.</span></div>

      <section id="how-it-works" class="how-section section-wrap">
        <div class="section-heading"><p class="eyebrow">01 / THE LITTLE RITUAL</p><h2>Be in the moment.<br>Take a little <em>with you.</em></h2></div>
        <div class="steps">
          <article><span class="step-number">01</span><h3>A scan, and you’re in.</h3><p>Open your event’s QR pass on your phone. No downloads or passwords between you and a good photo.</p></article>
          <article><span class="step-number">02</span><h3>Make it your kind of you.</h3><p>Pick a frame. Gather your people. Add a little film nostalgia or an optional AI twist.</p></article>
          <article><span class="step-number">03</span><h3>Keep it. Send it. Love it.</h3><p>Your photo is ready to save and share. The organizer gets a collection of the day, too.</p></article>
        </div>
      </section>

      <section id="make-it-yours" class="playground">
        <div class="playground-inner section-wrap">
          <div class="frame-stage">
            <span class="stage-caption">A SMALL PREVIEW OF YOUR NEXT KEEPSAKE</span>
            <div class="sample-frame" :class="[selectedLayout, selectedStyle]" aria-label="Photo layout preview">
              <div class="sample-photos">
                <img :src="imagePath('wedding-v2.png')" alt="Wedding keepsake preview" width="1122" height="1402" loading="lazy">
                <img v-if="selectedLayout === 'strip'" :src="imagePath('wedding-v2.png')" alt="A second crop of the wedding sample" width="1122" height="1402" loading="lazy">
                <img v-if="selectedLayout === 'strip'" :src="imagePath('wedding-v2.png')" alt="A third crop of the wedding sample" width="1122" height="1402" loading="lazy">
              </div>
              <div class="sample-caption"><span>the people make the party.</span><b>ourlo</b></div>
            </div>
            <span class="handwritten stage-note">something to come back to.</span>
          </div>
          <div class="playground-copy">
            <p class="eyebrow">02 / A LITTLE PERSONALITY</p>
            <h2>Same moment.<br>Your <em>own way.</em></h2>
            <p>A classic strip for the fridge. A polaroid for the group chat. Little details that make a photo feel like yours.</p>
            <fieldset><legend>PICK YOUR FRAME</legend><div class="layout-options"><button v-for="layout in layouts" :key="layout.id" :aria-pressed="selectedLayout === layout.id" :class="{ active: selectedLayout === layout.id }" @click="selectedLayout = layout.id"><span class="layout-icon" :class="layout.id" aria-hidden="true"><i></i><i v-if="layout.id === 'strip'"></i><i v-if="layout.id === 'strip'"></i></span>{{ layout.name }}</button></div></fieldset>
            <fieldset><legend>SET THE MOOD</legend><div class="style-options"><button v-for="style in styles" :key="style.id" :aria-pressed="selectedStyle === style.id" :class="{ active: selectedStyle === style.id }" @click="selectedStyle = style.id"><span :class="style.id" aria-hidden="true"></span>{{ style.name }}</button></div></fieldset>
            <p class="preview-note" aria-live="polite">{{ layouts.find(l => l.id === selectedLayout)?.name }} · {{ styles.find(s => s.id === selectedStyle)?.name }}<br>Sample preview. Your event’s frames and styles may vary.</p>
          </div>
        </div>
      </section>

      <section id="your-kind-of-moment" class="moments section-wrap">
        <div class="moments-heading"><div><p class="eyebrow">03 / WHEREVER YOUR PEOPLE ARE</p><h2>Big feelings.<br><em>Any occasion.</em></h2></div><p>From “I do” to “your serve.”<br>If it brings you together, it belongs here.</p></div>
        <div class="moment-grid">
          <article class="moment-card wedding-card"><div class="moment-image"><img :src="imagePath('wedding-v2.png')" alt="A bride and male guest sharing laughter at an outdoor wedding celebration" width="1122" height="1402" loading="lazy"><span class="image-label">THE BIG YES</span></div><div class="moment-description"><h3>For the love of it.</h3><p>Weddings, engagements & happy tears.</p></div></article>
          <article class="moment-card tennis-card"><div class="moment-image"><img :src="imagePath('tennis-v2.png')" alt="A woman and man enjoying a laugh together beside the tennis court" width="1448" height="1086" loading="lazy"><span class="image-label">THE GOOD GAME</span></div><div class="moment-description"><h3>For the fun of it.</h3><p>Match days, team days & just-because days.</p></div></article>
        </div>
      </section>

      <section id="questions" class="faq-section section-wrap"><div><p class="eyebrow">THE PRACTICAL BITS</p><h2>A few things<br>you might <em>wonder.</em></h2></div><div class="faq-list"><details v-for="faq in faqs" :key="faq.q"><summary>{{ faq.q }}<span aria-hidden="true">+</span></summary><p>{{ faq.a }}</p></details></div></section>

      <section class="closing"><p class="eyebrow">SOMETHING GOOD IS IN THE MAKING</p><h2>The day goes.<br><em>The feeling stays.</em></h2><p>A photobox for your people.<br>Coming soon to a moment near you.</p><NuxtLink to="/demo" class="button button-yellow">Try the guest demo <span aria-hidden="true">↗</span></NuxtLink><div class="closing-flower" aria-hidden="true">✳</div></section>
    </main>
    <footer class="footer section-wrap"><NuxtLink class="wordmark" to="/" aria-label="Ourlo home">ourlo<span class="logo-dot">✳</span></NuxtLink><p>This moment is ours.</p><span>© {{ new Date().getFullYear() }} Ourlo</span></footer>
  </div>
</template>
