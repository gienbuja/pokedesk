<script setup lang="ts">
import type { Pokemon } from '@/types';

defineProps<{
  pokemon: Pokemon
}>();
</script>

<template>
  <span class="image-container">
    <img :src="pokemon.sprites.other['official-artwork'].front_shiny" :alt="pokemon.name">
  </span>
</template>

<style scoped>
.image-container {
  width: 100%;
  height: 180px;
  position: absolute;
  top: 20px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>