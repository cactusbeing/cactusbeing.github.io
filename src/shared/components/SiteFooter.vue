<template>
  <footer class="site-footer">
    <div class="container">
      <img
        class="footer-decoration"
        src="/assets/decor/canva-botanical-sprig.png"
        width="198"
        height="100"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <a class="footer-brand" href="/index.html"
        ><img src="/assets/icon.png" width="25" height="25" alt="" />特教百寶袋</a
      >
      <p>讓理解多一點，讓學習的可能多一點。</p>
      <nav aria-label="頁尾導覽">
        <a href="/about.html">關於創作者</a><a href="/contact.html">聯繫我們</a
        ><a href="https://www.instagram.com/cactusbeingorz">Instagram</a
        ><a href="https://medium.com/@cactusbeing">Medium</a>
      </nav>
      <small
        >© {{ new Date().getFullYear() }} Cactusbeing Website
        <span aria-hidden="true">·</span> 用理解與支持，陪伴每一步。</small
      >
    </div>
  </footer>
</template>
<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-muted);
  text-align: center;
  padding: 28px 0 32px;
  font-size: 0.76rem;
}
.footer-decoration {
  display: block;
  width: 100px;
  height: 72px;
  object-fit: cover;
  object-position: left;
  margin: 0 auto 8px;
  mix-blend-mode: darken;
  pointer-events: none;
}
.footer-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 1.2rem;
  font-weight: 700;
}
.footer-brand img {
  width: 25px;
  height: 25px;
}
.site-footer p {
  margin: 8px 0 0;
  font-size: 0.76rem;
}
nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 20px;
}
nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  text-decoration: none;
  font-size: 0.7rem;
  color: var(--color-text-muted);
}
nav a:hover {
  color: var(--color-primary);
}
small {
  font-size: 0.62rem;
}
small > span {
  margin: 0 5px;
}
</style>
