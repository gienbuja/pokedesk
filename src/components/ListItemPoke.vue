<script setup lang="ts">
import type { Pokemon } from '@/types';
import FavoriteRoundedIcon from './icons/FavoriteRoundedIcon.vue';

defineProps<{
  pokemon: Pokemon,
  isFavorite: boolean
}>();

const emit = defineEmits<{
  (e: 'toggleFavorite', pokemon: Pokemon): void,
  (e: 'pokemonClick', pokemon: Pokemon): void
}>();
</script>

<template>
  <li>
    <span @click="emit('pokemonClick', pokemon)">
      {{ pokemon.name }}
    </span>
    <button @click.stop="emit('toggleFavorite', pokemon)">
      <FavoriteRoundedIcon :favorite="isFavorite" />
    </button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 20px;
  background: #FFFFFF;
  border-radius: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
}

span {
  font-family: Lato;
  font-weight: 500;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  text-transform: capitalize;
  color: #353535;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

button {
  width: 44px;
  height: 44px;
}
</style>
