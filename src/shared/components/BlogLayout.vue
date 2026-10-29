<script setup lang="ts">
import SiteIcon from './SiteIcon.vue';
import { articleCategories, articleEntries } from '../../content/article-details';
import { resources } from '../../content/resources';
const tags = [...new Set(articleEntries.flatMap((article) => article.tags))];
const archives = [...new Set(articleEntries.map((article) => article.date.slice(0, 7)))]
  .sort((a, b) => b.localeCompare(a))
  .map((month) => ({
    month,
    label: `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`,
    count: articleEntries.filter((article) => article.date.startsWith(month)).length,
  }));
</script>
<template>
  <div class="blog-layout">
    <aside class="left-sidebar" aria-label="創作者與資源分類">
      <section class="sidebar-card profile-card">
        <div class="profile-top">
          <SiteIcon name="leaf" /><span>NICE TO MEET YOU</span><span aria-hidden="true">✧</span>
        </div>
        <img
          class="profile-avatar"
          src="/assets/icon.png"
          alt="仙人掌星人"
          width="84"
          height="84"
        />
        <h2>仙人掌星人</h2>
        <p class="profile-role">特殊教育工作者</p>
        <p class="profile-bio">用理解與支持，<br />陪伴每一種學習步調。</p>
        <div class="profile-stats">
          <a href="/post.html"
            ><strong>{{ articleEntries.length }}</strong
            ><span>文章</span></a
          ><a href="/教材.html"
            ><strong>{{ resources.length }}</strong
            ><span>教材分類</span></a
          ><a href="/tool.html"><strong>2</strong><span>實用工具</span></a>
        </div>
        <div class="profile-social">
          <a href="https://www.instagram.com/cactusbeingorz" aria-label="仙人掌星人的 Instagram"
            ><SiteIcon name="person" /></a
          ><a href="https://medium.com/@cactusbeing" aria-label="仙人掌星人的 Medium 文章"
            ><SiteIcon name="book" /></a
          ><a href="/contact.html" aria-label="聯繫仙人掌星人"><SiteIcon name="mail" /></a>
        </div>
        <p class="profile-note">讓學習的可能，多一點。</p>
      </section>
      <section class="sidebar-card sidebar-panel">
        <h2><SiteIcon name="folder" />文章分類</h2>
        <a
          v-for="category in articleCategories.slice(1)"
          :key="category.id"
          class="category-link"
          :href="`/post.html?category=${category.id}`"
          ><span>{{ category.label }}</span
          ><span class="category-count">{{
            String(
              articleEntries.filter((article) => article.category === category.id).length,
            ).padStart(2, '0')
          }}</span></a
        >
      </section>
      <section class="sidebar-card sidebar-panel">
        <h2><SiteIcon name="tag" />主題關鍵字</h2>
        <div class="tag-cloud">
          <a
            v-for="(tag, index) in tags"
            :key="tag"
            :class="{ 'forest-tag': index % 2 === 0 }"
            :href="`/post.html?tag=${encodeURIComponent(tag)}`"
            >{{ tag }}</a
          >
        </div>
      </section>
      <a class="sidebar-card contact-card" href="/教材.html"
        ><SiteIcon name="leaf" />
        <div><strong>收藏一點教學靈感</strong><small>帶進下一次陪伴與教學</small></div>
        <SiteIcon name="arrow" :size="14"
      /></a>
    </aside>
    <div class="blog-content"><slot /></div>
    <aside class="right-sidebar" aria-label="網站消息與最新文章">
      <section class="sidebar-card sidebar-panel notice-card">
        <h2>
          <SiteIcon name="megaphone" />小站公告<span class="notice-dot" aria-hidden="true"></span>
        </h2>
        <p>歡迎來到特教百寶袋。</p>
        <p class="muted">
          這裡有教學資源、特教文章，也有幫助觀察與理解行為的小工具。希望能陪伴你的教學日常。
        </p>
        <a class="small-link" href="/about.html">認識一下我 <SiteIcon name="arrow" :size="13" /></a>
      </section>
      <section class="sidebar-card sidebar-panel">
        <h2><SiteIcon name="clock" />最近文章</h2>
        <ol class="recent-list">
          <li v-for="(article, index) in articleEntries.slice(0, 4)" :key="article.href">
            <span class="recent-number">0{{ index + 1 }}</span
            ><a :href="article.href"
              >{{ article.title
              }}<time :datetime="article.date">{{ article.date.replaceAll('-', ' / ') }}</time></a
            >
          </li>
        </ol>
      </section>
      <section class="sidebar-card sidebar-panel">
        <h2><SiteIcon name="calendar" />時光歸檔</h2>
        <a v-for="archive in archives" :key="archive.month" class="archive-link" :href="`/post.html?month=${archive.month}`"
          ><span>{{ archive.label }}</span><span>{{ archive.count }} 篇文章</span></a
        >
      </section>
      <blockquote class="sidebar-card quote-card">
        <span aria-hidden="true">“</span>
        <p>用理解，<br />打開學習的<br />更多可能。</p>
        <small>A LITTLE REMINDER</small><SiteIcon name="leaf" :size="80" />
      </blockquote>
      <div class="site-notes">
        <SiteIcon name="leaf" />
        <p>小站正在慢慢生長中</p>
        <small>理解・分享・一起成長</small>
      </div>
    </aside>
  </div>
</template>
<style scoped>
.blog-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 210px;
  gap: 24px;
  align-items: start;
}
.left-sidebar,
.right-sidebar {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.blog-content {
  min-width: 0;
}
.sidebar-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.sidebar-panel {
  padding: 22px;
}
.sidebar-panel h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 17px;
  font-size: 0.94rem;
  letter-spacing: 0;
}
.sidebar-panel h2 svg {
  color: var(--color-primary);
  flex-shrink: 0;
}
.profile-card {
  text-align: center;
}
.profile-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--color-primary-soft);
  padding: 17px 12px;
  color: var(--color-primary);
}
.profile-top span:first-of-type {
  font-size: 0.5rem;
  letter-spacing: 0.13em;
  font-weight: 700;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  object-fit: contain;
  padding: 14px;
  border-radius: 24px;
  background: var(--color-accent-soft);
  margin: 0 auto;
  transform: translateY(-5px);
  border: 5px solid white;
}
.profile-card h2 {
  font-size: 1.15rem;
  margin: 4px 0;
}
.profile-role {
  font-size: 0.75rem;
  color: var(--color-primary);
  margin: 0 0 20px;
}
.profile-bio {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.9;
}
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 16px 18px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--color-border);
}
.profile-stats a {
  text-decoration: none;
  color: var(--color-text);
  min-height: 44px;
}
.profile-stats strong {
  display: block;
  font-size: 1.15rem;
  font-weight: 600;
}
.profile-stats span {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}
.profile-social {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.profile-social a {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--color-surface-muted);
  border-radius: 12px;
}
.profile-note {
  font-size: 0.65rem;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  margin: 14px 16px 16px;
  padding: 7px;
  border-radius: 9px;
}
.category-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  min-height: 44px;
  text-decoration: none;
  color: var(--color-text);
  gap: 8px;
}
.category-link:hover {
  color: var(--color-primary);
}
.category-count {
  font-size: 0.62rem;
  padding: 1px 6px;
  background: var(--color-surface-muted);
  color: var(--color-primary);
  border-radius: 5px;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-cloud a {
  padding: 5px 7px;
  font-size: 0.62rem;
  border-radius: 6px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  text-decoration: none;
}
.tag-cloud a.forest-tag {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.contact-card {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.contact-card strong {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
}
.contact-card small {
  display: block;
  font-size: 0.6rem;
  color: var(--color-text-muted);
  margin-top: 5px;
}
.notice-card {
  background: var(--color-surface-muted);
}
.notice-card p {
  font-size: 0.74rem;
  line-height: 1.95;
}
.notice-dot {
  margin-left: auto;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-primary);
}
.small-link {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  font-size: 0.75rem;
  padding-block: 7px;
  text-decoration: none;
}
.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 18px;
}
.recent-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.recent-number {
  flex: 0 0 18px;
  white-space: nowrap;
  color: var(--color-primary);
  font-size: 0.7rem;
}
.recent-list a {
  font-size: 0.72rem;
  text-decoration: none;
  color: var(--color-text);
  line-height: 1.8;
}
.recent-list time {
  display: block;
  font-size: 0.6rem;
  color: var(--color-text-muted);
  margin-top: 6px;
}
.archive-link {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.72rem;
  padding-block: 7px;
}
.archive-link span:last-child {
  color: var(--color-text-muted);
  font-size: 0.65rem;
}
.quote-card {
  position: relative;
  padding: 22px;
  margin: 0;
  background: var(--color-surface-muted);
  color: var(--color-primary);
}
.quote-card > span {
  font-size: 2.5rem;
  line-height: 1;
  opacity: 0.65;
}
.quote-card p {
  font-size: 1.1rem;
  line-height: 2;
  margin: 15px 0 22px;
}
.quote-card small {
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
}
.quote-card > svg {
  position: absolute;
  right: -8px;
  bottom: -8px;
  opacity: 0.1;
}
.site-notes {
  text-align: center;
  color: var(--color-accent);
  padding: 0 12px;
}
.site-notes p {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  margin: 8px 0;
}
.site-notes small {
  color: var(--color-text-muted);
  font-size: 0.6rem;
}
@media (max-width: 1180px) {
  .blog-layout {
    grid-template-columns: 210px minmax(0, 1fr);
  }
  .right-sidebar {
    display: none;
  }
}
@media (max-width: 900px) {
  .blog-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .left-sidebar {
    display: none;
  }
}
</style>
