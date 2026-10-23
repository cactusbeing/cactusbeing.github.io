<script setup lang="ts">
import SiteHeader from '../shared/components/SiteHeader.vue';
import SiteFooter from '../shared/components/SiteFooter.vue';
import HomeApp from '../features/home/HomeApp.vue';
</script>
<template>
  <SiteHeader />
  <main id="main-content" class="container page-main" tabindex="-1"><HomeApp /></main>
  <SiteFooter />
</template>
