<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import BannerGarden from './BannerGarden.vue';
import { sitePathname } from '../site-path';
import { imageSource, imageSrcset } from '../responsive-images';

const path = sitePathname();
const home = path === '/' || path === '/index.html';
const posts = path === '/post.html' || path === '/post-old.html';
const banner = ref<HTMLElement>();
const inView = ref(true);
const tabHidden = ref(false);
const motionState = computed(() => (inView.value && !tabHidden.value ? 'running' : 'paused'));
let observer: IntersectionObserver | undefined;
function updateVisibility() {
  tabHidden.value = document.hidden;
}
onMounted(() => {
  updateVisibility();
  document.addEventListener('visibilitychange', updateVisibility);
  if ('IntersectionObserver' in window && banner.value) {
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry.isIntersecting;
    });
    observer.observe(banner.value);
  }
});
onUnmounted(() => {
  document.removeEventListener('visibilitychange', updateVisibility);
  observer?.disconnect();
});
</script>
<template>
  <section
    ref="banner"
    class="site-banner"
    :class="{ 'is-home': home }"
    :data-motion="motionState"
    :aria-label="home ? '特殊教育・資源與陪伴' : '理解、分享與陪伴'"
  >
    <img
      class="banner-photo"
      :src="imageSource('/assets/img/home-bg.jpg')"
      :srcset="imageSrcset('/assets/img/home-bg.jpg')"
      sizes="(max-width: 767px) 540px, 100vw"
      width="3828"
      height="2552"
      alt=""
      aria-hidden="true"
      fetchpriority="high"
      decoding="async"
    />
    <div class="banner-shade"></div>
    <BannerGarden v-if="home" />
    <div class="banner-content">
      <span class="banner-eyebrow">A LITTLE SPACE FOR LEARNING & GROWTH</span
      ><component :is="home ? 'h1' : 'p'" class="banner-title"
        >{{
          home
            ? '每一種不同，都值得被理解。'
            : posts
              ? '每一篇，都是多一點理解。'
              : '用理解，陪伴每一步成長。'
        }}<span v-if="!home" class="sparkle" aria-hidden="true">✧</span></component
      >
      <blockquote v-if="home" class="banner-quote">
        <p>「把燈提高一點，可以照亮更多人。」</p>
        <cite>Helen Keller</cite>
      </blockquote>
      <p v-else class="banner-description">
        把教學的靈感、實用的工具與溫柔的理解，收進你的特教百寶袋。
      </p>
    </div>
    <span class="side-note" aria-hidden="true">EVERY LITTLE STEP MATTERS</span>
    <svg class="banner-waves" viewBox="0 0 1440 85" preserveAspectRatio="none" aria-hidden="true">
      <g class="wave-layer">
        <path
          d="M-1680 45C-1260-60-420 150 0 45S1260 150 1680 45S2940 150 3360 45V180H-1680Z"
          fill="var(--color-wave)"
          opacity=".65"
        />
      </g>
      <g class="wave-layer">
        <path
          d="M-1680 55C-1260-30-420 140 0 55S1260 140 1680 55S2940 140 3360 55V180H-1680Z"
          fill="var(--color-bg)"
          opacity=".65"
        />
      </g>
      <g class="wave-layer">
        <path
          d="M-1680 70C-1260 30-420 110 0 70S1260 110 1680 70S2940 110 3360 70V180H-1680Z"
          fill="var(--color-bg)"
        />
      </g>
    </svg>
  </section>
</template>
<style scoped>
.site-banner {
  position: relative;
  isolation: isolate;
  height: 310px;
  background: var(--color-surface);
  color: var(--color-banner-text);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.banner-photo {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 52%;
  pointer-events: none;
}
.banner-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(110deg, var(--color-banner-start), var(--color-banner-end));
}
.banner-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  padding: 60px 24px 35px;
  text-align: center;
}
.banner-eyebrow {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-banner-muted);
}
.banner-title {
  font-size: clamp(1.65rem, 3.1vw, 2.35rem);
  font-weight: 750;
  letter-spacing: 0.035em;
  line-height: 1.5;
  margin: 14px 0 8px;
  color: var(--color-banner-text);
  text-wrap: balance;
}
.sparkle {
  color: var(--color-image-accent);
  padding-left: 0.4rem;
}
.banner-description {
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  margin: 0;
  color: var(--color-banner-muted);
}
.banner-waves {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 75px;
  z-index: 2;
  pointer-events: none;
}
.side-note {
  position: absolute;
  right: 24px;
  top: 110px;
  writing-mode: vertical-rl;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--color-banner-muted);
}
@media (max-width: 767px) {
  .site-banner {
    height: 285px;
  }
  .banner-content {
    padding: 65px 22px 40px;
  }
  .banner-title {
    font-size: 1.65rem;
  }
  .banner-eyebrow {
    letter-spacing: 0.08em;
  }
  .banner-description {
    font-size: 0.8rem;
    line-height: 1.9;
  }
  .sparkle {
    display: none;
  }
  .side-note {
    display: none;
  }
  .banner-waves {
    height: 38px;
  }
}

.site-banner.is-home {
  height: auto;
  min-height: 350px;
}
.is-home .banner-content {
  padding-top: 92px;
  padding-bottom: 88px;
}
.is-home .banner-title {
  animation: banner-welcome 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.is-home .banner-quote {
  animation: banner-welcome 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both;
}
.is-home .side-note {
  display: none;
}
@keyframes banner-welcome {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
[data-motion='paused'] .wave-layer,
[data-motion='paused'] .banner-title,
[data-motion='paused'] .banner-quote,
[data-motion='paused'] :deep(.garden-piece),
[data-motion='paused'] :deep(.garden-art) {
  animation-play-state: paused;
}
.banner-quote {
  margin: 14px 0 0;
}
.banner-quote p {
  color: var(--color-banner-text);
  font-size: 1rem;
  margin: 0 0 3px;
  letter-spacing: 0.04em;
}
.banner-quote cite {
  color: var(--color-banner-muted);
  font-style: normal;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
}
/* Match the reference's 8/12/16s linear cycles and 175/150 viewport travel.
   Each path repeats every 1680 units, so the loop remains seamless. */
.wave-layer {
  animation: wave-drift 8s linear infinite;
}
.wave-layer:nth-child(2) {
  animation-duration: 12s;
}
.wave-layer:nth-child(3) {
  animation-duration: 16s;
}
@keyframes wave-drift {
  from {
    transform: translate3d(-864px, 0, 0);
  }
  to {
    transform: translate3d(816px, 0, 0);
  }
}
@media (max-width: 767px) {
  .site-banner.is-home {
    height: auto;
    min-height: 360px;
  }
  .is-home .banner-content {
    padding: 84px 22px 76px;
  }
  .banner-quote p {
    font-size: 0.9rem;
    line-height: 1.85;
  }
  .banner-content {
    padding-bottom: 60px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wave-layer,
  .is-home .banner-title,
  .is-home .banner-quote {
    animation: none;
  }
}
</style>
