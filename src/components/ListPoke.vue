<template>
  <ul class="list-poke">
    <ListItemPoke v-for="pokemon in pokemons" :key="pokemon.name" :pokemon="pokemon" :is-favorite="isFavorite(pokemon)"
      @toggle-favorite="handleToggleFavorite" @pokemon-click="handlePokemonClick" />
  </ul>
</template>
<script setup lang="ts">
import type { Pokemon } from '@/types';
import { usePokemonStore } from '@/stores/pokemon.store';
import ListItemPoke from './ListItemPoke.vue';

const pokemonStore = usePokemonStore();

const pokemons = defineModel<Pokemon[]>('pokemons');

const emit = defineEmits<{
  (e: 'toggleFavorite', pokemon: Pokemon): void,
  (e: 'pokemonClick', pokemon: Pokemon): void
}>();

const handlePokemonClick = (pokemon: Pokemon) => {
  emit('pokemonClick', pokemon);
};

const handleToggleFavorite = (pokemon: Pokemon) => {
  emit('toggleFavorite', pokemon);
};

const isFavorite = (pokemon: Pokemon) => {
  return pokemonStore.isFavorite(pokemon.name);
};
</script>

<style scoped>
.list-poke {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
