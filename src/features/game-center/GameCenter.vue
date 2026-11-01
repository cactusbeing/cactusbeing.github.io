<script setup lang="ts">
import SiteIcon from '../../shared/components/SiteIcon.vue';
</script>
<template>
  <section class="game-center" aria-labelledby="games-title">
    <div class="games-heading">
      <div>
        <h1 id="games-title">遊戲百寶箱</h1>
        <p>從校園裡的相遇，到生活中的小練習，一起慢慢學。</p>
      </div>
      <a href="/">返回特教百寶袋 <SiteIcon name="arrow" :size="16" /></a>
    </div>
    <div class="game-entries">
      <article class="game-entry money-entry">
        <a class="entry-picture" href="/game/money/" aria-label="遊玩特教班互動遊戲：認識新台幣"><img src="/assets/money/tea-shop.webp" width="1536" height="1024" alt="百寶茶舖裡，店員準備好飲料，等你一起練習點餐。" loading="lazy" /></a>
        <div class="entry-copy">
          <h2>特教班互動遊戲：認識新台幣</h2>
          <p class="tagline">從一個硬幣，到自己買一杯飲料。</p>
          <p>看真實錢幣，練習認面額、湊金額與找零。走進百寶茶舖，和店員聊一聊，選飲料、加料，再自己付款。</p>
          <div class="entry-meta"><span>特教班生活數學</span><span>硬幣＋紙鈔</span><span>不限時・可朗讀</span></div>
          <a class="entry-play" href="/game/money/">開始認識新台幣 <SiteIcon name="arrow" :size="18" /></a>
        </div>
      </article>
      <article class="game-entry campus-entry">
        <a class="entry-picture" href="/game/campus/" aria-label="遊玩特教宣導遊戲：同一座校園"
          ><img
            src="/assets/decor/campus-invitation.png"
            width="1568"
            height="523"
            alt="像素校園裡，四位同學一起站在樹蔭下。"
            loading="lazy"
        /></a>
        <div class="entry-copy">
          <h2>特教宣導遊戲：同一座校園</h2>
          <p class="tagline">每次相遇，多一點理解。</p>
          <p>
            從進校門到放學，探索教室、操場與辦公室。八個情境、二十四次選擇，練習現場回應、如實回報與後續支持。
          </p>
          <div class="entry-meta">
            <span>校園探索 RPG</span><span>八個生活情境</span><span>接續原有進度</span>
          </div>
          <a class="entry-play" href="/game/campus/"
            >走進校園的一天 <SiteIcon name="arrow" :size="18"
          /></a>
        </div>
      </article>
    </div>
    <p class="games-note">
      免費・單人・免登入。遊戲進度只保存在目前瀏覽器。
    </p>
  </section>
</template>
<style scoped>
.game-center {
  max-width: 1120px;
  margin: 0 auto 40px;
}
.games-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}
.games-heading h1 {
  font-size: 2.25rem;
  margin: 0 0 8px;
  color: var(--color-primary);
}
.games-heading p {
  margin: 0;
}
.games-heading .eyebrow {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.games-heading a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 0.9rem;
}
.game-entries {
  display: grid;
  gap: 28px;
}
.game-entry {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
}
.entry-picture {
  display: block;
  min-height: 310px;
  background: #d8e9dc;
  overflow: hidden;
}
.entry-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.campus-entry .entry-picture img {
  object-position: 76% center;
}
.entry-copy {
  padding: 30px 34px;
}
.entry-copy h2 {
  font-size: 1.65rem;
  line-height: 1.5;
  margin: 7px 0 0;
  color: #2f6348;
}
.entry-copy .tagline {
  font-size: 1.05rem;
  color: #596b3d;
  margin: 4px 0 12px;
}
.entry-copy p {
  font-size: 0.95rem;
  line-height: 1.85;
  margin: 0 0 16px;
}
.entry-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 0.76rem;
  color: #596b5d;
  margin-bottom: 22px;
}
.entry-play {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 11px 17px;
  background: #2f6348;
  color: white;
  border-radius: 12px;
  font-weight: 650;
  min-height: 44px;
}
.entry-play:hover {
  background: #244f3a;
}
.games-note {
  text-align: center;
  font-size: 0.85rem;
  margin: 26px auto;
  color: var(--color-text-muted);
}
@media (max-width: 700px) {
  .games-heading {
    display: block;
  }
  .games-heading a {
    margin-top: 12px;
  }
  .games-heading h1 {
    font-size: 1.8rem;
  }
  .game-entry {
    grid-template-columns: 1fr;
  }
  .entry-picture {
    min-height: 0;
    height: 200px;
  }
  .entry-copy {
    padding: 24px;
  }
  .entry-copy h2 {
    font-size: 1.45rem;
  }
}
</style>
