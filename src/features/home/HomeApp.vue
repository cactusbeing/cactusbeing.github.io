<script setup lang="ts">
import ArticleFeed from '../articles/ArticleFeed.vue';
import BlogLayout from '../../shared/components/BlogLayout.vue';
import SiteIcon from '../../shared/components/SiteIcon.vue';
import { resources } from '../../content/resources';
import { imageSource, imageSrcset } from '../../shared/responsive-images';
</script>
<template>
  <BlogLayout>
    <ArticleFeed home>
      <template #discovery>
        <section class="game-invitation" aria-labelledby="game-invitation-title">
          <img
            class="game-invitation-art"
            :src="imageSource('/assets/decor/games-invitation.webp')"
            :srcset="imageSrcset('/assets/decor/games-invitation.webp')"
            sizes="(max-width: 600px) 540px, (max-width: 900px) 100vw, 800px"
            width="2172" height="724" alt="" aria-hidden="true"
            loading="lazy" decoding="async" fetchpriority="low"
          />
          <div class="game-invitation-copy">
            <h2 id="game-invitation-title">遊戲百寶箱</h2>
            <p>從校園裡理解差異，到手搖店練習點餐與用錢，讓每次遊戲都成為生活的小練習。</p>
            <a class="game-invitation-action" href="/game/">打開遊戲百寶箱 <SiteIcon name="arrow" :size="18" /></a>
          </div>
        </section>
        <section class="home-resources" aria-labelledby="home-resources-title">
          <div class="resource-introduction">
            <div class="section-heading">
              <div>
                <h2 id="home-resources-title">站內精選教材</h2>
                <p>涵蓋實務操作與生活應用的專屬特教資源</p>
              </div>
              <a href="/教材.html">所有教材 <SiteIcon name="arrow" :size="16" /></a>
            </div>
            <img
              class="resource-decoration"
              :src="imageSource('/assets/decor/canva-cactus-books.png')"
              width="198"
              height="100"
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          </div>
          <div class="resource-grid">
            <component
              :is="resource.comingSoon ? 'div' : 'a'"
              v-for="resource in [resources[1], resources[4], resources[0]]"
              :key="resource.title"
              :href="resource.comingSoon ? undefined : resource.href"
              :aria-disabled="resource.comingSoon || undefined"
              class="resource-entry"
            >
              <img
                :src="imageSource(resource.image)"
                :srcset="imageSrcset(resource.image)"
                sizes="(max-width: 374px) 72px, (max-width: 767px) 96px, (max-width: 900px) 28vw, 240px"
                width="500" height="300" alt="" loading="lazy" decoding="async"
              />
              <div class="resource-heading">
                <h3>{{ resource.title }}</h3>
                <span>{{ resource.comingSoon ? '準備中' : `${resource.files.length} 份 PDF` }}</span>
              </div>
              <p>{{ resource.description }}</p>
              <span class="resource-action">{{ resource.comingSoon ? '暫未開放' : '查看教材' }} <SiteIcon v-if="!resource.comingSoon" name="arrow" :size="16" /></span>
            </component>
          </div>
        </section>
        <section class="home-tools" aria-labelledby="home-tools-title">
          <div class="section-heading">
            <div>
              <h2 id="home-tools-title">專業評量與記錄工具</h2>
              <p>協助教育工作者更有效率地進行行為觀察與分析</p>
            </div>
            <a href="/tool.html">工具專區 <SiteIcon name="arrow" :size="16" /></a>
          </div>
          <div class="tool-grid">
            <a href="/behavior-tool.html" class="tool-entry">
              <SiteIcon name="clock" :size="28" />
              <div>
                <h3>行為記錄工具</h3>
                <p>快速且精準地記錄與追蹤目標行為發生的頻率、時間點與前因後果。</p>
                <span>開啟工具 <SiteIcon name="arrow" :size="16" /></span>
              </div>
            </a>
            <a href="/aba-tool.html" class="tool-entry">
              <SiteIcon name="tools" :size="28" />
              <div>
                <h3>FBA 行為功能評量</h3>
                <p>系統化分析特殊需求學生行為背後的功能與目的，擬定介入策略。</p>
                <span>開啟工具 <SiteIcon name="arrow" :size="16" /></span>
              </div>
            </a>
          </div>
        </section>
      </template>
    </ArticleFeed>
  </BlogLayout>
</template>
<style scoped>
.game-invitation {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: 320px;
  padding: 28px 24px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
.game-invitation-art {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  pointer-events: none;
}
.game-invitation::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(90deg, rgb(255 255 255 / 96%) 0%, rgb(255 255 255 / 88%) 30%, rgb(255 255 255 / 65%) 44%, transparent 64%);
  pointer-events: none;
}
.game-invitation-copy {
  position: relative;
  z-index: 2;
  width: 46%;
  max-width: 340px;
}
.game-invitation h2 {
  color: var(--color-primary);
  font-size: 1.5rem;
  line-height: 1.5;
}
.game-invitation-copy p {
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.85;
  margin: 12px 0 20px;
}
.game-invitation-action {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 10px 16px;
  border-radius: var(--radius-control);
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: .9375rem;
  font-weight: 650;
  text-decoration: none;
}
.game-invitation-action:hover {
  background: var(--color-primary-hover);
  color: var(--color-surface);
}
@media (max-width: 600px) {
  .game-invitation {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;
    padding: 0;
  }
  .game-invitation-copy {
    order: 0;
    width: auto;
    max-width: none;
    padding: 24px 20px 12px;
  }
  .game-invitation-art {
    position: relative;
    inset: auto;
    order: 1;
    height: 190px;
    object-position: right center;
  }
  .game-invitation::after { display: none; }
}
.home-resources,
.home-tools {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}
.home-tools {
  background: var(--color-primary-soft);
}
.section-heading {
  align-items: center;
  margin-bottom: 20px;
}
.resource-introduction {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.home-resources {
  background: var(--color-bg);
}
.resource-introduction .section-heading {
  flex-wrap: wrap;
  margin-bottom: 0;
}
.resource-decoration {
  width: 92px;
  height: 100px;
  object-fit: cover;
  object-position: right;
  mix-blend-mode: darken;
  pointer-events: none;
}
h2 {
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: 0;
  margin: 0 0 8px;
}
.section-heading p {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin: 0;
}
.section-heading > a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  flex-shrink: 0;
  font-size: 0.875rem;
  text-decoration: none;
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.resource-entry {
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  text-decoration: none;
  min-width: 0;
}
.resource-entry[aria-disabled='true'] {
  filter: grayscale(1);
}
.resource-entry > img {
  width: 100%;
  aspect-ratio: 5 / 3;
  object-fit: cover;
  border-radius: var(--radius-card);
  margin-bottom: 16px;
}
.resource-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0;
}
.resource-heading > span {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.resource-entry p,
.tool-entry p {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin: 8px 0 12px;
}
.home-tools p {
  color: var(--color-text);
}
.resource-action,
.tool-entry span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--color-primary);
  font-size: 0.875rem;
  margin-top: auto;
}
a.resource-entry:hover h3,
.tool-entry:hover h3 {
  color: var(--color-primary);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.tool-entry {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  color: var(--color-text);
  text-decoration: none;
  padding-block: 8px;
}
.tool-entry > svg {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 3px;
}
@media (max-width: 767px) {
  .home-resources,
  .home-tools {
    padding: 20px;
  }
  h2 {
    font-size: 1.25rem;
  }
  .resource-grid,
  .tool-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .resource-entry {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 0 16px;
  }
  .resource-entry > img {
    grid-row: 1 / 4;
    aspect-ratio: 1;
    margin: 0;
  }
  .resource-heading {
    flex-wrap: wrap;
    gap: 4px 12px;
  }
  .resource-entry p {
    grid-column: 2;
  }
  .resource-action {
    grid-column: 2;
  }
  .tool-grid {
    gap: 24px;
  }
}
@media (max-width: 374px) {
  .resource-introduction {
    grid-template-columns: minmax(0, 1fr) 64px;
    gap: 8px;
  }
  .resource-decoration {
    width: 64px;
    height: 80px;
  }
  .resource-entry {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 0 12px;
  }
}
</style>
