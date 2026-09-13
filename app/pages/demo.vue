<script setup lang="ts">
useHead({
  title: 'Guest demo — Ourlo',
  meta: [{ name: 'description', content: 'Try the Ourlo guest photobox flow with a sample event.' }]
})

type LayoutId = 'strip' | 'polaroid' | 'square'
type StyleId = 'original' | 'film' | 'mono' | 'pastel'

const stage = ref(0)
const baseURL = useRuntimeConfig().app.baseURL
const imagePath = (file: string) => `${baseURL}images/${file}`
const selectedLayout = ref<LayoutId>('strip')
const selectedStyle = ref<StyleId>('original')
const selectedPhotos = ref<string[]>([])
const remainingOutputs = ref(10)
const remainingAi = ref(3)
const resultMessage = ref('')
const createdObjectUrls: string[] = []

const layouts = [
  { id: 'strip' as LayoutId, name: 'Photo strip', shots: 3, note: 'Three little moments' },
  { id: 'polaroid' as LayoutId, name: 'Polaroid', shots: 1, note: 'Classic & generous' },
  { id: 'square' as LayoutId, name: 'Square', shots: 1, note: 'Ready for sharing' }
]

const styles = [
  { id: 'original' as StyleId, name: 'Just us', note: 'Original', cost: 0 },
  { id: 'film' as StyleId, name: 'Golden hour', note: 'Local preset', cost: 0 },
  { id: 'mono' as StyleId, name: 'Sunday paper', note: 'Local preset', cost: 0 },
  { id: 'pastel' as StyleId, name: 'Painted softly', note: 'AI · 1 credit', cost: 1 }
]

const currentLayout = computed(() => layouts.find(item => item.id === selectedLayout.value)!)
const currentStyle = computed(() => styles.find(item => item.id === selectedStyle.value)!)
const filledCount = computed(() => selectedPhotos.value.filter(Boolean).length)
const canContinuePhotos = computed(() => filledCount.value === currentLayout.value.shots)
const previewPhotos = computed(() => selectedPhotos.value.length ? selectedPhotos.value : [imagePath('wedding-v2.webp')])

function chooseLayout(id: LayoutId) {
  selectedLayout.value = id
  const shots = layouts.find(item => item.id === id)!.shots
  selectedPhotos.value = selectedPhotos.value.slice(0, shots)
}

function useSample(index: number) {
  const samples = [imagePath('wedding-v2.webp'), imagePath('tennis-v2.webp'), imagePath('wedding-v2.webp')]
  selectedPhotos.value[index] = samples[index % samples.length]
  selectedPhotos.value = [...selectedPhotos.value]
}

function handleUpload(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  createdObjectUrls.push(url)
  selectedPhotos.value[index] = url
  selectedPhotos.value = [...selectedPhotos.value]
}

function fillWithSamples() {
  selectedPhotos.value = Array.from({ length: currentLayout.value.shots }, (_, index) =>
    index === 1 ? imagePath('tennis-v2.webp') : imagePath('wedding-v2.webp')
  )
}

function goBack() {
  if (stage.value === 6) stage.value = 4
  else if (stage.value > 0 && stage.value !== 5) stage.value -= 1
}

function createKeepsake() {
  stage.value = 5
  window.setTimeout(() => {
    remainingOutputs.value = Math.max(0, remainingOutputs.value - 1)
    if (currentStyle.value.cost) remainingAi.value = Math.max(0, remainingAi.value - 1)
    stage.value = 6
  }, 1800)
}

function makeAnother() {
  selectedPhotos.value = []
  selectedStyle.value = 'original'
  stage.value = 1
}

function resetDemo() {
  selectedLayout.value = 'strip'
  selectedStyle.value = 'original'
  selectedPhotos.value = []
  remainingOutputs.value = 10
  remainingAi.value = 3
  resultMessage.value = ''
  stage.value = 0
}

async function shareResult() {
  const shareData = { title: 'Maya & Rafi — Ourlo', text: 'A little piece of being there.', url: window.location.href }
  try {
    if (navigator.share) await navigator.share(shareData)
    else {
      await navigator.clipboard.writeText(window.location.href)
      resultMessage.value = 'Demo link copied.'
    }
  } catch {
    resultMessage.value = 'Share cancelled — your photo is still here.'
  }
}

onBeforeUnmount(() => createdObjectUrls.forEach(url => URL.revokeObjectURL(url)))
</script>

<template>
  <div class="demo-page">
    <header class="demo-site-header">
      <NuxtLink class="demo-wordmark" to="/" aria-label="Back to Ourlo">ourlo<span>✳︎</span></NuxtLink>
      <div class="demo-label"><i></i> Guest-flow prototype</div>
      <NuxtLink class="back-home" to="/">Back to the story <span aria-hidden="true">↗</span></NuxtLink>
    </header>

    <main class="demo-main">
      <aside class="demo-intro">
        <p class="demo-kicker">TRY IT LIKE A GUEST</p>
        <h1>One QR.<br><em>A little magic.</em></h1>
        <p>Walk through an Ourlo event on your own phone. Everything here is a safe preview—nothing is uploaded.</p>

        <div class="demo-notes">
          <div><span>01</span><p><b>No guest account</b>Enter through a private event pass.</p></div>
          <div><span>02</span><p><b>Clear allowances</b>Guests always know what remains.</p></div>
          <div><span>03</span><p><b>Your event, your edit</b>Only approved frames and styles appear.</p></div>
        </div>

        <button class="reset-link" type="button" @click="resetDemo">↺ Reset the demo</button>
      </aside>

      <section class="device-area" aria-label="Interactive Ourlo guest demo">
        <div class="demo-card">
          <div class="device-bar">
            <button v-if="stage > 0 && stage !== 5" class="icon-button" type="button" aria-label="Go back" @click="goBack">←</button>
            <span v-else class="icon-space"></span>
            <span class="event-monogram">M <i>&</i> R</span>
            <span class="allowance-pill">{{ remainingOutputs }} left</span>
          </div>

          <div v-if="stage > 0 && stage < 5" class="progress" aria-label="Demo progress">
            <span v-for="n in 4" :key="n" :class="{ active: n <= stage }"></span>
          </div>

          <div class="screen" :class="{ 'screen-processing': stage === 5 }">
            <Transition name="screen" mode="out-in">
              <div v-if="stage === 0" key="welcome" class="welcome-screen">
                <div class="event-photo">
                  <img :src="imagePath('wedding-v2.webp')" alt="Maya and Rafi's sample wedding event" width="1122" height="1402">
                  <span>YOU’RE INVITED IN</span>
                </div>
                <p class="mini-kicker">14 FEB 2027 · BALI</p>
                <h2>Maya <i>&</i> Rafi</h2>
                <p>Welcome, Table 08. Make something worth keeping.</p>
                <div class="pass-summary">
                  <div><b>{{ remainingOutputs }}</b><span>keepsakes</span></div>
                  <div><b>{{ remainingAi }}</b><span>AI edits</span></div>
                </div>
                <button class="primary-action" type="button" @click="stage = 1">Start making <span>↗</span></button>
                <small>Demo pass · no sign-in needed</small>
              </div>

              <div v-else-if="stage === 1" key="layout" class="flow-screen">
                <p class="step-kicker">STEP 1 OF 4</p>
                <h2>How should this<br><i>one feel?</i></h2>
                <p class="screen-copy">Choose a frame first—we’ll tell you how many photos you need.</p>
                <div class="demo-layouts">
                  <button v-for="layout in layouts" :key="layout.id" type="button" :aria-pressed="selectedLayout === layout.id" :class="['demo-layout-card', { selected: selectedLayout === layout.id }]" @click="chooseLayout(layout.id)">
                    <span class="demo-layout-preview" :class="layout.id"><i v-for="n in layout.shots" :key="n"></i></span>
                    <span><b>{{ layout.name }}</b><small>{{ layout.note }} · {{ layout.shots }} {{ layout.shots === 1 ? 'photo' : 'photos' }}</small></span>
                    <em aria-hidden="true">{{ selectedLayout === layout.id ? '✓' : '○' }}</em>
                  </button>
                </div>
                <button class="primary-action" type="button" @click="stage = 2">Choose photos <span>↗</span></button>
              </div>

              <div v-else-if="stage === 2" key="photos" class="flow-screen photo-screen">
                <p class="step-kicker">STEP 2 OF 4</p>
                <h2>Now, the<br><i>good part.</i></h2>
                <p class="screen-copy">Add {{ currentLayout.shots }} {{ currentLayout.shots === 1 ? 'photo' : 'photos' }}. Your own images stay on this device in the demo.</p>
                <div class="photo-slots" :class="selectedLayout">
                  <div v-for="(_, index) in currentLayout.shots" :key="index" class="photo-slot" :class="{ filled: selectedPhotos[index] }">
                    <img v-if="selectedPhotos[index]" :src="selectedPhotos[index]" :alt="`Selected photo ${index + 1}`">
                    <span v-else>{{ String(index + 1).padStart(2, '0') }}</span>
                    <div class="slot-actions">
                      <label :for="`photo-${index}`">{{ selectedPhotos[index] ? 'Replace' : 'Choose photo' }}</label>
                      <input :id="`photo-${index}`" type="file" accept="image/*" capture="environment" @change="handleUpload($event, index)">
                      <button type="button" @click="useSample(index)">Use sample</button>
                    </div>
                  </div>
                </div>
                <button v-if="!canContinuePhotos" class="sample-fill" type="button" @click="fillWithSamples">Fill all with demo photos</button>
                <button class="primary-action" type="button" :disabled="!canContinuePhotos" @click="stage = 3">Style the photos <span>↗</span></button>
                <small>{{ filledCount }} of {{ currentLayout.shots }} added</small>
              </div>

              <div v-else-if="stage === 3" key="style" class="flow-screen style-screen">
                <p class="step-kicker">STEP 3 OF 4</p>
                <h2>Keep it true.<br><i>Or play a little.</i></h2>
                <p class="screen-copy">Local presets are free. AI styles use the separate allowance shown on your pass.</p>
                <div class="style-hero" :class="selectedStyle">
                  <img :src="previewPhotos[0]" alt="Selected style preview">
                  <span>{{ currentStyle.name }}</span>
                </div>
                <div class="demo-styles">
                  <button v-for="style in styles" :key="style.id" type="button" :aria-pressed="selectedStyle === style.id" :class="[{ selected: selectedStyle === style.id }, style.id]" @click="selectedStyle = style.id">
                    <span></span><b>{{ style.name }}</b><small>{{ style.note }}</small>
                  </button>
                </div>
                <p v-if="currentStyle.cost" class="ai-note">✳︎ AI look simulated for this prototype · {{ remainingAi }} credits available</p>
                <button class="primary-action" type="button" @click="stage = 4">See the keepsake <span>↗</span></button>
              </div>

              <div v-else-if="stage === 4" key="preview" class="flow-screen preview-screen">
                <p class="step-kicker">STEP 4 OF 4</p>
                <h2>One last<br><i>little look.</i></h2>
                <div class="result-frame" :class="[selectedLayout, selectedStyle]">
                  <div class="result-images">
                    <img v-for="(photo, index) in previewPhotos" :key="`${photo}-${index}`" :src="photo" alt="">
                  </div>
                  <div class="result-caption"><span>MAYA & RAFI · 14.02.27</span><b>ourlo</b></div>
                </div>
                <div class="charge-summary">
                  <span>1 keepsake</span><span>{{ currentStyle.cost ? '1 AI credit' : 'No AI credits' }}</span>
                </div>
                <button class="primary-action" type="button" @click="createKeepsake">Create keepsake <span>✳︎</span></button>
                <button class="quiet-action" type="button" @click="stage = 3">Change the style</button>
              </div>

              <div v-else-if="stage === 5" key="processing" class="processing-screen" aria-live="polite">
                <div class="processing-mark"><span>✳︎</span><i></i></div>
                <p class="step-kicker">MAKING YOUR KEEPSAKE</p>
                <h2>Hold that<br><i>feeling.</i></h2>
                <p>Framing the good part…</p>
                <div class="loading-line"><span></span></div>
                <small>Keep this page open for the demo</small>
              </div>

              <div v-else key="result" class="flow-screen final-screen">
                <p class="step-kicker">YOURS TO KEEP</p>
                <h2>Look at<br><i>you two.</i></h2>
                <div class="result-frame final" :class="[selectedLayout, selectedStyle]">
                  <div class="result-images">
                    <img v-for="(photo, index) in previewPhotos" :key="`${photo}-${index}`" :src="photo" alt="">
                  </div>
                  <div class="result-caption"><span>MAYA & RAFI · 14.02.27</span><b>ourlo</b></div>
                </div>
                <div class="result-actions">
                  <a class="primary-action" :href="previewPhotos[0]" download="ourlo-demo-photo.webp">Save sample <span>↓</span></a>
                  <button class="share-action" type="button" @click="shareResult">Share <span>↗</span></button>
                </div>
                <p v-if="resultMessage" class="result-message" aria-live="polite">{{ resultMessage }}</p>
                <button class="quiet-action" type="button" @click="makeAnother">Make another · {{ remainingOutputs }} left</button>
              </div>
            </Transition>
          </div>
        </div>
        <p class="device-footnote"><span>✳︎</span> Interactive prototype · AI and cloud uploads are simulated</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.demo-page{min-height:100vh;background:#f2e9df;color:#561d32;background-image:radial-gradient(#561d3210 1px,transparent 1px);background-size:22px 22px}.demo-site-header{height:88px;width:min(1420px,calc(100% - 64px));margin:auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-bottom:1px solid #561d3225}.demo-wordmark{font-family:var(--serif);font-size:43px;letter-spacing:-3px;line-height:1}.demo-wordmark span{font-family:var(--sans);font-size:16px;margin-left:5px;vertical-align:top}.demo-label{font-size:12px;text-transform:uppercase;letter-spacing:1.7px;font-weight:600;display:flex;align-items:center;gap:9px}.demo-label i{width:7px;height:7px;background:#d6794f;border-radius:50%}.back-home{justify-self:end;font-size:13px;font-weight:600;border-bottom:1px solid currentColor;padding-bottom:4px}.back-home span{margin-left:9px}.demo-main{width:min(1260px,calc(100% - 80px));margin:auto;display:grid;grid-template-columns:minmax(340px, .82fr) minmax(460px,1.18fr);gap:100px;align-items:center;min-height:calc(100vh - 88px);padding:55px 0 65px}.demo-intro{padding-left:20px}.demo-kicker,.step-kicker{font-size:11px;letter-spacing:1.8px;font-weight:700}.demo-intro h1{font-size:clamp(57px,5.5vw,82px);line-height:1.02;margin:22px 0 25px}.demo-intro h1 em{font-weight:400}.demo-intro>p:not(.demo-kicker){color:#76666b;max-width:420px;font-size:16px}.demo-notes{margin-top:42px;border-top:1px solid #561d3225;max-width:430px}.demo-notes>div{display:grid;grid-template-columns:38px 1fr;gap:15px;padding:17px 0;border-bottom:1px solid #561d3225}.demo-notes>div>span{font-family:var(--serif);font-style:italic;font-size:17px}.demo-notes p{font-size:13px;line-height:1.45;color:#76666b}.demo-notes b{display:block;color:#561d32;font-size:14px;margin-bottom:2px}.reset-link,.quiet-action{background:none;border:0;padding:0;color:#561d32;font-weight:600;font-size:13px;text-decoration:underline;text-underline-offset:5px}.reset-link{margin-top:25px}.device-area{display:flex;align-items:center;flex-direction:column}.demo-card{width:430px;min-height:720px;background:#faf7ef;border:1px solid #561d3230;border-radius:30px;box-shadow:0 24px 60px #561d3223,0 2px 4px #561d3214;overflow:hidden;position:relative}.device-bar{height:67px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 20px;border-bottom:1px solid #561d321a}.icon-button{justify-self:start;border:1px solid #561d3228;background:transparent;width:35px;height:35px;border-radius:50%;font-size:18px}.icon-space{width:35px}.event-monogram{font-family:var(--serif);font-size:20px;letter-spacing:-1px}.event-monogram i{font-weight:400;margin:0 2px}.allowance-pill{justify-self:end;background:#eee0d5;border-radius:20px;padding:7px 10px;font-size:11px;font-weight:700}.progress{display:flex;gap:5px;padding:15px 22px 2px}.progress span{height:3px;flex:1;background:#ded0cc;border-radius:3px}.progress span.active{background:#561d32}.screen{padding:24px 24px 27px;min-height:653px;display:flex}.screen>div{width:100%}.welcome-screen{text-align:center;display:flex;flex-direction:column;align-items:center}.event-photo{width:235px;height:270px;margin:3px auto 23px;position:relative;transform:rotate(-2.5deg);background:#fff;padding:9px 9px 30px;box-shadow:0 10px 25px #561d321c}.event-photo img{width:100%;height:100%;object-position:50% 35%}.event-photo span{position:absolute;left:0;right:0;bottom:9px;font-size:8px;letter-spacing:1.5px;font-weight:700}.mini-kicker{font-size:9px;letter-spacing:1.5px;font-weight:700}.welcome-screen h2,.flow-screen h2,.processing-screen h2{font-family:var(--serif);font-size:42px;letter-spacing:-1.5px;line-height:1.02;font-weight:400;margin:9px 0 12px}.welcome-screen h2 i,.flow-screen h2 i,.processing-screen h2 i{font-weight:400}.welcome-screen>p:not(.mini-kicker){font-size:13px;color:#76666b;max-width:280px}.pass-summary{width:100%;display:grid;grid-template-columns:1fr 1fr;margin:24px 0 17px;border-block:1px solid #561d3222}.pass-summary>div{padding:12px}.pass-summary>div+div{border-left:1px solid #561d3222}.pass-summary b{font-family:var(--serif);font-size:24px;font-weight:400;display:block}.pass-summary span{font-size:9px;text-transform:uppercase;letter-spacing:1px}.primary-action,.share-action{width:100%;min-height:51px;border-radius:27px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;font-weight:600;font-size:14px}.primary-action{border:1px solid #561d32;background:#561d32;color:#faf7ef}.primary-action:hover{background:#703047}.primary-action:disabled{opacity:.38;cursor:not-allowed}.primary-action span,.share-action span{font-size:18px}.welcome-screen small,.photo-screen>small{font-size:10px;color:#8f7d80;margin-top:11px}.flow-screen{display:flex;flex-direction:column}.flow-screen .step-kicker{margin-top:3px}.screen-copy{font-size:13px;color:#76666b;line-height:1.55;margin-bottom:20px}.demo-layouts{display:grid;gap:9px;margin-bottom:17px}.demo-layout-card{min-height:92px;background:#fffaf3;border:1px solid #d9c9c5;border-radius:14px;padding:11px 13px;display:grid;grid-template-columns:55px 1fr 22px;align-items:center;gap:13px;text-align:left}.demo-layout-card.selected{border:2px solid #561d32;padding:10px 12px;background:#f5e9e5}.demo-layout-card>span:nth-child(2) b{display:block;font-size:14px}.demo-layout-card small{display:block;color:#8b777b;font-size:10px;margin-top:3px}.demo-layout-card em{font-style:normal;font-size:18px}.demo-layout-preview{background:#fff;border:1px solid #cdbab7;padding:4px;display:grid;gap:2px;box-shadow:0 3px 6px #561d3213}.demo-layout-preview.strip{width:27px;height:58px;margin:auto}.demo-layout-preview.polaroid{width:43px;height:52px;padding-bottom:12px;margin:auto}.demo-layout-preview.square{width:45px;height:45px;margin:auto}.demo-layout-preview i{background:#d9b6b7}.photo-slots{display:grid;gap:9px;margin-bottom:12px}.photo-slots.strip{grid-template-columns:repeat(3,1fr)}.photo-slot{height:245px;border:1px dashed #a88c92;background:#f2e7e0;border-radius:11px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.photo-slot>span{font-family:var(--serif);font-size:24px;color:#a88c92}.photo-slot>img{width:100%;height:100%;object-fit:cover}.photo-slots.strip .photo-slot{height:220px}.slot-actions{position:absolute;left:6px;right:6px;bottom:6px;display:flex;flex-direction:column;gap:4px}.slot-actions label,.slot-actions button{border:0;border-radius:16px;background:#faf7efeb;color:#561d32;text-align:center;padding:6px 5px;font-size:9px;font-weight:700;cursor:pointer}.slot-actions button{background:#561d32e8;color:white}.slot-actions input{position:absolute;width:1px;height:1px;overflow:hidden;opacity:0}.sample-fill{border:0;background:transparent;color:#561d32;text-decoration:underline;text-underline-offset:4px;font-size:11px;font-weight:700;margin:0 auto 12px}.photo-screen .primary-action{margin-top:auto}.style-hero{height:210px;border-radius:120px 120px 12px 12px;overflow:hidden;position:relative;background:#e7cacd;margin-bottom:14px}.style-hero img{width:100%;height:100%;object-position:50% 37%;transition:filter .3s}.style-hero>span{position:absolute;left:13px;bottom:12px;background:#faf7ef;padding:6px 10px;font-size:9px;letter-spacing:1px;text-transform:uppercase;font-weight:700}.film img,.result-frame.film img{filter:sepia(.45) saturate(.82) contrast(.95)}.mono img,.result-frame.mono img{filter:grayscale(1) contrast(1.08)}.pastel img,.result-frame.pastel img{filter:saturate(.68) brightness(1.08) contrast(.88) hue-rotate(-8deg)}.demo-styles{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px}.demo-styles button{background:transparent;border:1px solid #d9c9c5;border-radius:10px;padding:9px;display:grid;grid-template-columns:23px 1fr;text-align:left;column-gap:7px}.demo-styles button.selected{border:2px solid #561d32;padding:8px;background:#f5e9e5}.demo-styles button>span{grid-row:1/3;width:22px;height:22px;border-radius:50%;background:#e6d9d0}.demo-styles button.film>span{background:#b67a4d}.demo-styles button.mono>span{background:#4b4446}.demo-styles button.pastel>span{background:linear-gradient(135deg,#eabdc4,#e8d78a,#bdcedf)}.demo-styles b{font-size:11px}.demo-styles small{font-size:8px;color:#88777a}.ai-note{font-size:9px;background:#eee0a6;padding:8px 10px;border-radius:8px;margin-bottom:12px}.style-screen .primary-action{margin-top:auto}.preview-screen{align-items:center;text-align:center}.preview-screen h2{align-self:flex-start;text-align:left}.result-frame{background:#fffdf8;padding:8px 8px 0;width:172px;box-shadow:0 12px 25px #561d3229;transform:rotate(-2deg);margin:6px auto 18px}.result-images{display:grid;gap:5px}.result-images img{width:100%;height:100%;object-fit:cover;object-position:50% 35%}.result-frame.strip .result-images img{height:92px}.result-frame.polaroid,.result-frame.square{width:250px;transform:rotate(2deg)}.result-frame.polaroid .result-images img{height:275px}.result-frame.square .result-images img{height:235px}.result-caption{min-height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 7px}.result-caption span{font-size:7px;letter-spacing:.8px}.result-caption b{font-family:var(--serif);font-weight:400;font-size:20px}.charge-summary{width:100%;display:flex;justify-content:space-between;border-block:1px solid #ded0cc;padding:10px 2px;margin-bottom:14px;font-size:10px}.preview-screen .quiet-action{margin-top:13px}.screen-processing{background:#561d32;color:#faf7ef}.processing-screen{display:flex;align-items:center;flex-direction:column;justify-content:center;text-align:center}.processing-mark{width:90px;height:90px;position:relative;display:grid;place-items:center;margin-bottom:25px}.processing-mark span{font-size:56px;animation:spin 3s linear infinite}.processing-mark i{position:absolute;inset:0;border:1px solid #eedc7950;border-radius:50%;animation:pulse 1.6s ease-in-out infinite}.processing-screen .step-kicker{color:#eedc79}.processing-screen h2{font-size:50px}.processing-screen>p{font-size:13px;opacity:.75}.processing-screen>small{font-size:9px;opacity:.55;margin-top:14px}.loading-line{height:3px;width:210px;background:#ffffff22;margin-top:25px;overflow:hidden;border-radius:4px}.loading-line span{display:block;height:100%;background:#eedc79;animation:load 1.8s ease-in-out forwards}.final-screen{align-items:center;text-align:center}.final-screen h2{margin-bottom:8px}.result-frame.final{margin-top:3px}.result-actions{display:grid;grid-template-columns:1.25fr .75fr;gap:8px;width:100%;margin-top:2px}.result-actions .primary-action{text-decoration:none}.share-action{border:1px solid #561d32;background:transparent;color:#561d32}.final-screen .quiet-action{margin-top:18px}.result-message{font-size:10px;margin-top:9px;color:#76666b}.device-footnote{font-size:10px;letter-spacing:.4px;color:#7f6c70;margin-top:15px}.device-footnote span{color:#561d32;margin-right:5px}.screen-enter-active,.screen-leave-active{transition:opacity .18s,transform .18s}.screen-enter-from{opacity:0;transform:translateY(8px)}.screen-leave-to{opacity:0;transform:translateY(-5px)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{transform:scale(1.2);opacity:.3}}@keyframes load{from{width:0}to{width:100%}}

@media(max-width:950px){.demo-main{grid-template-columns:1fr;gap:38px;padding-top:35px}.demo-intro{text-align:center;padding:0}.demo-intro h1{font-size:60px}.demo-intro>p:not(.demo-kicker){margin:auto}.demo-notes{display:none}.reset-link{margin-top:14px}.demo-site-header{width:calc(100% - 40px)}.device-footnote{margin-bottom:30px}}
@media(max-width:540px){.demo-page{background:#faf7ef}.demo-site-header{height:66px;width:calc(100% - 32px);grid-template-columns:1fr auto;border-bottom-color:#561d3218}.demo-wordmark{font-size:35px}.demo-label{font-size:9px;letter-spacing:1px}.demo-label i{width:6px;height:6px}.back-home{display:none}.demo-main{width:100%;display:block;min-height:auto;padding:0}.demo-intro{display:none}.demo-card{width:100%;min-height:calc(100vh - 66px);border:0;border-radius:0;box-shadow:none}.device-bar{height:58px}.screen{min-height:calc(100vh - 124px);padding:20px 20px 26px}.progress{padding-inline:20px}.device-footnote{display:none}.welcome-screen{justify-content:center}.event-photo{width:min(235px,65vw);height:min(270px,71vw)}.flow-screen h2,.welcome-screen h2{font-size:39px}.photo-slots.strip .photo-slot{height:min(220px,53vw)}.style-hero{height:min(210px,49vw)}.result-frame.strip .result-images img{height:min(92px,22vw)}}
@media(max-width:370px){.screen{padding:16px}.demo-layout-card{min-height:82px}.welcome-screen h2,.flow-screen h2{font-size:36px}.event-photo{margin-bottom:15px}.pass-summary{margin-block:16px 13px}.photo-slots.strip{gap:5px}.slot-actions label,.slot-actions button{font-size:8px;padding:5px 3px}}
@media(prefers-reduced-motion:reduce){.processing-mark span,.processing-mark i,.loading-line span{animation:none}.loading-line span{width:100%}}
</style>
