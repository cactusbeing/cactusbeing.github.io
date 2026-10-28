<script setup lang="ts">
import { imageSource } from '../responsive-images';
const plants = [
  { id: 'tall-left', asset: 'cactus-tall' },
  { id: 'pear-left', asset: 'cactus-pear' },
  { id: 'succulent-left', asset: 'succulent' },
  { id: 'books-left', asset: 'books' },
  { id: 'spray-left', asset: 'leaf-spray' },
  { id: 'eucalyptus-left', asset: 'leaf-eucalyptus' },
  { id: 'tall-right', asset: 'cactus-tall' },
  { id: 'pear-right', asset: 'cactus-pear' },
  { id: 'succulent-right', asset: 'succulent' },
  { id: 'spray-right', asset: 'leaf-spray' },
  { id: 'eucalyptus-right', asset: 'leaf-eucalyptus' },
];
</script>

<template>
  <div class="banner-garden" aria-hidden="true">
    <svg class="garden-compositing" width="0" height="0" focusable="false">
      <defs>
        <filter id="garden-paper-cutout" color-interpolation-filters="sRGB">
          <!-- Derive alpha from the actual black background; retain the original paint colors. -->
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    4 4 4 0 -0.16"
          />
        </filter>
      </defs>
    </svg>
    <span
      v-for="plant in plants"
      :key="plant.id"
      class="garden-piece"
      :class="plant.id"
      :data-asset="plant.asset"
    >
      <img
        class="garden-art"
        :src="imageSource(`/assets/decor/banner/${plant.asset}.png`)"
        alt=""
        width="200"
        height="200"
        decoding="async"
        draggable="false"
      />
    </span>
  </div>
</template>

<style scoped>
.banner-garden {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
.garden-compositing {
  position: absolute;
}
.garden-piece {
  position: absolute;
  display: block;
  width: var(--plant-size);
  height: var(--plant-size);
  transform-origin: center bottom;
  animation: garden-arrive 850ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--arrive-delay, 0ms);
}
.garden-art {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: url('#garden-paper-cutout');
  transform-origin: 50% 90%;
}
.tall-left {
  --plant-size: 180px;
  left: max(12px, calc(50% - 650px));
  bottom: 39px;
}
.pear-left {
  --plant-size: 112px;
  --arrive-delay: 70ms;
  left: max(125px, calc(50% - 525px));
  bottom: 32px;
}
.succulent-left {
  --plant-size: 94px;
  --arrive-delay: 120ms;
  left: max(10px, calc(50% - 653px));
  bottom: 26px;
}
.books-left {
  --plant-size: 108px;
  --arrive-delay: 150ms;
  left: max(200px, calc(50% - 449px));
  bottom: 30px;
}
.spray-left {
  --plant-size: 145px;
  --arrive-delay: 180ms;
  left: -39px;
  top: 88px;
  opacity: 0.65;
}
.eucalyptus-left {
  --plant-size: 105px;
  --arrive-delay: 200ms;
  left: max(187px, calc(50% - 463px));
  bottom: 106px;
  opacity: 0.48;
}
.tall-right {
  --plant-size: 120px;
  --arrive-delay: 70ms;
  right: max(205px, calc(50% - 445px));
  bottom: 36px;
}
.pear-right {
  --plant-size: 174px;
  --arrive-delay: 110ms;
  right: max(38px, calc(50% - 620px));
  bottom: 32px;
}
.succulent-right {
  --plant-size: 110px;
  --arrive-delay: 160ms;
  right: max(0px, calc(50% - 675px));
  bottom: 25px;
}
.spray-right {
  --plant-size: 130px;
  --arrive-delay: 180ms;
  right: max(190px, calc(50% - 460px));
  bottom: 112px;
  opacity: 0.52;
}
.eucalyptus-right {
  --plant-size: 158px;
  --arrive-delay: 220ms;
  right: -28px;
  top: 78px;
  opacity: 0.68;
}
.spray-left .garden-art,
.spray-right .garden-art {
  animation: leaf-breeze 7s ease-in-out infinite alternate;
}
.eucalyptus-left .garden-art,
.eucalyptus-right .garden-art {
  animation: leaf-breeze 9s ease-in-out -3s infinite alternate-reverse;
}
.spray-right .garden-art {
  scale: -1 1;
}
@keyframes garden-arrive {
  from {
    transform: translateY(18px) scaleY(0.92);
    opacity: 0;
  }
  to {
    transform: translateY(0) scaleY(1);
  }
}
@keyframes leaf-breeze {
  from {
    transform: rotate(-1.5deg);
  }
  to {
    transform: rotate(1.5deg);
  }
}
@media (min-width: 1101px) and (max-width: 1240px) {
  .books-left {
    --plant-size: 96px;
    left: 190px;
  }
  .eucalyptus-left {
    --plant-size: 90px;
    left: 173px;
  }
  .tall-right {
    --plant-size: 105px;
    right: 185px;
  }
  .spray-right {
    --plant-size: 110px;
    right: 160px;
  }
  .pear-right {
    --plant-size: 160px;
    right: 32px;
  }
}
@media (max-width: 1100px) {
  .books-left,
  .pear-left,
  .eucalyptus-left,
  .tall-right,
  .spray-right {
    display: none;
  }
  .tall-left {
    --plant-size: 140px;
    left: 0;
    bottom: 26px;
  }
  .succulent-left {
    --plant-size: 74px;
    left: 74px;
    bottom: 28px;
  }
  .pear-right {
    --plant-size: 125px;
    right: 20px;
    bottom: 26px;
  }
  .succulent-right {
    --plant-size: 74px;
    right: 0;
  }
  .spray-left,
  .eucalyptus-right {
    --plant-size: 100px;
    top: 96px;
    opacity: 0.45;
  }
}
@media (max-width: 767px) {
  .succulent-left,
  .pear-right,
  .eucalyptus-right {
    display: none;
  }
  .tall-left {
    --plant-size: 82px;
    left: 1px;
    bottom: 15px;
  }
  .succulent-right {
    --plant-size: 75px;
    right: 5px;
    bottom: 12px;
  }
  .spray-left {
    --plant-size: 76px;
    left: -17px;
    top: auto;
    bottom: 39px;
    opacity: 0.55;
  }
  .spray-right {
    --plant-size: 72px;
    display: block;
    right: -14px;
    bottom: 36px;
    opacity: 0.55;
  }
}
@media (prefers-reduced-motion: reduce) {
  .garden-piece,
  .garden-art {
    animation: none;
  }
}
</style>
