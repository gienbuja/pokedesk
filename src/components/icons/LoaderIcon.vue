<script setup lang="ts">
import type { Pokemon } from '@/types';
import type { PropType } from 'vue';

defineProps({
  favoritePokemons: {
    type: Array as PropType<Array<Pokemon>>,
    required: true
  }
})
</script>

<template>
  <div class="loading-view">
    <svg width="106" height="106" viewBox="0 0 106 106" fill="none" xmlns="http://www.w3.org/2000/svg"
      class="pokeball-animation">
      <circle cx="53" cy="53" r="51" fill="white" stroke="#333333" stroke-width="4" />
      <mask id="mask0_12_50" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="106" height="53">
        <rect width="106" height="53" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_12_50)">
        <circle cx="53" cy="53" r="51" fill="#F22539" stroke="#333333" stroke-width="4" />
      </g>
      <path d="M0.392578 53H105.607" stroke="#333333" stroke-width="4" />
      <circle cx="53" cy="52.9998" r="20.8074" fill="white" />
      <circle cx="53" cy="52.9998" r="18.8074" stroke="#333333" stroke-width="4" />
      <path d="M91.731 36.7077C86.9398 25.3318 77.283 16.5081 65.3667 12.8428" stroke="white" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="53.0001" cy="53.0004" r="10.3852" stroke="#808080" stroke-width="2" />
    </svg>
    <span>
      {{ favoritePokemons.length }}
    </span>
  </div>
</template>

<style scoped>
.pokeball-animation {
  animation: roll 2s cubic-bezier(.36, .07, .19, .97), shake 3s cubic-bezier(.36, .07, .19, .97) 2s 3, catch 0.5s ease-out 10s forwards;
  transform: translate3d(0, 0, 0);
}

@keyframes roll {
  0% {
    transform: translateX(-200%) rotate(-360deg);
  }

  100% {
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes shake {
  0% {
    transform: translateX(0) rotate(0);
  }

  20% {
    transform: translateX(-10px) rotate(-20deg);
  }

  30% {
    transform: translateX(10px) rotate(20deg);
  }

  50% {
    transform: translateX(-10px) rotate(-10deg);
  }

  60% {
    transform: translateX(10px) rotate(10deg);
  }

  100% {
    transform: translateX(0) rotate(0);
  }
}

@keyframes catch {
  to {
    filter: saturate(0.8) brightness(0.8);
  }
}

.loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
