<script setup lang="ts">
import { computed, ref } from 'vue'

// Unaprijed zadani ilustrativni skorovi: 20 pozitivnih i 80 negativnih primjera.
// Prag 0,50 daje TP=4, FP=1, FN=16, TN=79 — kao na prethodnom slajdu.
const positiveScores = [0.12,0.16,0.21,0.25,0.27,0.29,0.31,0.33,0.35,0.37,0.39,0.41,0.43,0.45,0.46,0.49,0.54,0.63,0.74,0.88]
const negativeScores = [
  ...Array.from({ length: 79 }, (_, i) => +(0.03 + (((i * 31) % 79) / 79) * 0.45).toFixed(3)),
  0.62,
]
const threshold = ref(0.5)
const tp = computed(() => positiveScores.filter(score => score >= threshold.value).length)
const fp = computed(() => negativeScores.filter(score => score >= threshold.value).length)
const fn = computed(() => positiveScores.length - tp.value)
const tn = computed(() => negativeScores.length - fp.value)
const accuracy = computed(() => (tp.value + tn.value) / 100)
const precision = computed(() => tp.value + fp.value ? tp.value / (tp.value + fp.value) : 0)
const recall = computed(() => tp.value / positiveScores.length)
const f1 = computed(() => precision.value + recall.value ? 2 * precision.value * recall.value / (precision.value + recall.value) : 0)
const percent = (fraction: number) => (100 * fraction).toFixed(0) + ' %'
</script>

<template>
  <div class="threshold-demo">
    <div class="threshold-top">
      <section class="threshold-control" aria-label="Podešavanje klasifikacijskog praga">
        <div class="threshold-value-line">
          <span>Prag odluke</span>
          <output for="decision-threshold" data-testid="threshold-value">{{ threshold.toFixed(2) }}</output>
        </div>
        <input id="decision-threshold" v-model.number="threshold" type="range" min="0.05" max="0.95" step="0.05" aria-label="Prag klasifikacije" />
        <div class="threshold-scale"><span>0,05 — više pozitivnih</span><span>0,95 — manje pozitivnih</span></div>
        <div class="threshold-context">Isti model · 20 pozitivnih i 80 negativnih primjera</div>
      </section>
      <section class="threshold-confusion" aria-label="Matrica konfuzije">
        <div class="threshold-case tp"><span>TP</span><strong data-testid="tp">{{ tp }}</strong></div>
        <div class="threshold-case fp"><span>FP</span><strong data-testid="fp">{{ fp }}</strong></div>
        <div class="threshold-case fn"><span>FN</span><strong data-testid="fn">{{ fn }}</strong></div>
        <div class="threshold-case tn"><span>TN</span><strong data-testid="tn">{{ tn }}</strong></div>
      </section>
    </div>
    <div class="threshold-metrics">
      <div class="threshold-metric"><span>Accuracy</span><strong data-testid="accuracy">{{ percent(accuracy) }}</strong></div>
      <div class="threshold-metric"><span>Precision</span><strong data-testid="precision">{{ percent(precision) }}</strong></div>
      <div class="threshold-metric"><span>Recall / TPR</span><strong data-testid="recall">{{ percent(recall) }}</strong></div>
      <div class="threshold-metric"><span>F1</span><strong data-testid="f1">{{ percent(f1) }}</strong></div>
    </div>
    <div class="threshold-footer">
      <span>Pomakni prag i usporedi precision, recall i F1.</span>
      <button type="button" @click="threshold = 0.5">Vrati na 0,50</button>
    </div>
  </div>
</template>

<style scoped>
.threshold-demo{width:100%;display:flex;flex-direction:column;gap:15px;font-family:Lato,"DejaVu Sans",sans-serif;color:#f6f7fa;}
.threshold-top{display:grid;grid-template-columns:1.05fr 1fr;gap:20px;}
.threshold-control{border:2px solid #547d8d;border-radius:14px;background:rgba(22,41,54,.90);padding:18px 22px 14px;display:flex;flex-direction:column;justify-content:center;gap:14px;}
.threshold-value-line{display:flex;justify-content:space-between;align-items:center;font-size:27px;font-weight:800;}
.threshold-value-line output{font-size:48px;color:#92e2df;font-weight:900;line-height:1.05;font-variant-numeric:tabular-nums;}
.threshold-control input[type="range"]{width:100%;height:14px;cursor:pointer;accent-color:#ff6570;}
.threshold-scale{display:flex;justify-content:space-between;gap:8px;font-size:17px;color:#d5e7ed;}
.threshold-context{font-size:18px;color:#cfe2eb;border-top:1px solid rgba(196,226,240,.27);padding-top:9px;}
.threshold-confusion{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.threshold-case{border-radius:12px;border:2px solid rgba(162,198,213,.55);background:rgba(22,41,54,.89);padding:13px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:91px;}
.threshold-case span{font-size:27px;font-weight:900;}
.threshold-case strong{font-size:44px;line-height:1;font-weight:900;font-variant-numeric:tabular-nums;}
.threshold-case.tp strong,.threshold-case.tn strong{color:#a4e4d8;}
.threshold-case.fp strong,.threshold-case.fn strong{color:#ff9ca5;}
.threshold-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.threshold-metric{border-radius:12px;border:1.5px solid rgba(162,198,213,.50);background:rgba(22,41,54,.79);padding:12px 8px;display:flex;align-items:center;flex-direction:column;gap:4px;}
.threshold-metric span{font-size:19px;color:#d8e9ee;font-weight:700;}
.threshold-metric strong{font-size:33px;color:#fff;line-height:1.15;font-weight:900;font-variant-numeric:tabular-nums;}
.threshold-footer{display:flex;justify-content:space-between;align-items:center;gap:18px;font-size:19px;line-height:1.2;color:#cfe2eb;}
.threshold-footer button{color:#111c26;background:#ff7881;padding:9px 14px;border:none;border-radius:9px;font:700 20px Lato,"DejaVu Sans",sans-serif;cursor:pointer;}
.threshold-footer button:focus-visible,.threshold-control input:focus-visible{outline:3px solid #fff;outline-offset:3px;}
</style>
