<script setup lang="ts">
import SceneArt from '../chat-relay/components/SceneArt.vue';
const chatRelayUrl = `${import.meta.env.BASE_URL}game/chat-relay/`;
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
      <article class="game-entry chat-relay-entry">
        <a class="entry-picture" :href="chatRelayUrl" aria-label="遊玩社會技巧：聊天傳接球"><SceneArt home /></a>
        <div class="entry-copy">
          <h2>社會技巧：聊天傳接球</h2>
          <p class="tagline">接住話題，讓聊天自然繼續。</p>
          <p>走進六種生活場景，練習聆聽、接話、分享與收尾。60 組原創多回合情境，每個選擇都能看見不同回應；也可以安心說「我想先休息」。</p>
          <section class="entry-learning" aria-labelledby="chat-relay-goals">
            <h3 id="chat-relay-goals">學習目標</h3>
            <ul>
              <li>聽懂對方的話題與感受，選擇相關回應。</li>
              <li>輪流提問與分享，延續多回合對話。</li>
              <li>辨識休息與拒絕的訊號，尊重界線並自然收尾。</li>
            </ul>
          </section>
          <div class="entry-meta"><span>三種難度</span><span>四章教學</span><span>60 組生活情境</span></div>
          <a class="entry-play" :href="chatRelayUrl">開始聊天傳接球 <SiteIcon name="arrow" :size="18" /></a>
        </div>
      </article>
      <article class="game-entry money-entry">
        <a class="entry-picture" href="/game/money/" aria-label="遊玩生活數學：認識新台幣"><img src="/assets/money/tea-shop.webp" width="1536" height="1024" alt="百寶茶舖裡，店員準備好飲料，等你一起練習點餐。" loading="lazy" /></a>
        <div class="entry-copy">
          <h2>生活數學：認識新台幣</h2>
          <p class="tagline">從一個硬幣，到自己買一杯飲料。</p>
          <p>看真實錢幣，練習認面額、湊金額與找零。走進百寶茶舖，和店員聊一聊，選飲料、加料，再自己付款。</p>
          <section class="entry-learning" aria-labelledby="money-goals">
            <h3 id="money-goals">學習目標</h3>
            <ul>
              <li>辨認新台幣硬幣與紙鈔的外觀及面額。</li>
              <li>組合錢幣湊出指定金額，計算應找回的零錢。</li>
              <li>依購物流程點餐、確認金額並完成付款。</li>
            </ul>
          </section>
          <div class="entry-meta"><span>五種練習</span><span>硬幣＋紙鈔</span><span>點餐與購物</span></div>
          <a class="entry-play" href="/game/money/">開始認識新台幣 <SiteIcon name="arrow" :size="18" /></a>
        </div>
      </article>
      <article class="game-entry campus-entry">
        <a class="entry-picture" href="/game/campus/" aria-label="遊玩特教宣導：同一座校園"
          ><img
            src="/assets/decor/campus-invitation.png"
            width="1568"
            height="523"
            alt="像素校園裡，四位同學一起站在樹蔭下。"
            loading="lazy"
        /></a>
        <div class="entry-copy">
          <h2>特教宣導：同一座校園</h2>
          <p class="tagline">每次相遇，多一點理解。</p>
          <p>
            從進校門到放學，探索教室、操場與辦公室。八個情境、二十四次選擇，練習現場回應、如實回報與後續支持。
          </p>
          <section class="entry-learning" aria-labelledby="campus-goals">
            <h3 id="campus-goals">學習目標</h3>
            <ul>
              <li>辨識溝通、閱讀、感官與行動上的不同需要。</li>
              <li>先詢問本人，選擇尊重隱私與自主的支持方式。</li>
              <li>遇到安全事件適當求助、如實回報並追蹤支持。</li>
            </ul>
          </section>
          <div class="entry-meta">
            <span>校園探索 RPG</span><span>八個生活情境</span><span>二十四次選擇</span>
          </div>
          <a class="entry-play" href="/game/campus/"
            >走進校園的一天 <SiteIcon name="arrow" :size="18"
          /></a>
        </div>
      </article>
    </div>
    <p class="games-note">
      選一款遊戲，從感興趣的主題開始練習。
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
.chat-relay-entry .entry-picture{display:flex;align-items:center;background:#e6ecdf}.chat-relay-entry :deep(.scene-art){height:100%;aspect-ratio:1.5;border-radius:0}.chat-relay-entry :deep(.scene-person){bottom:7%;width:30%}
.campus-entry .entry-picture img {
  object-position: 76% center;
}
.entry-copy {
  min-width: 0;
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
.entry-learning {
  margin: 18px 0;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--color-surface-muted);
}
.entry-learning h3 {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.6;
}
.entry-learning ul {
  display: grid;
  gap: 7px;
  padding: 0 0 0 1.2em;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.75;
}
.entry-learning li::marker {
  color: var(--color-primary);
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
  .entry-learning {
    padding: 14px;
  }
}
</style>
