<template>
  <ul class="list-poke">
    <li v-for="pokemon in pokemons" :key="pokemon.name">
      <span @click="handlePokemonClick(pokemon)">
        {{ pokemon.name }}
      </span>
      <button @click.stop="handleToggleFavorite(pokemon)">
        <FavoriteRoundedIcon :favorite="pokemon.favorite" />
      </button>
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { PokemonList } from '@/types';
import FavoriteRoundedIcon from './icons/FavoriteRoundedIcon.vue';

const pokemons = defineModel<PokemonList[]>('pokemons');

const emit = defineEmits<{
  (e: 'toggleFavorite', pokemon: PokemonList): void,
  (e: 'pokemonClick', pokemon: PokemonList): void
}>();

const handlePokemonClick = (pokemon: PokemonList) => {
  emit('pokemonClick', pokemon);
};

const handleToggleFavorite = (pokemon: PokemonList) => {
  emit('toggleFavorite', pokemon);
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

.list-poke li {
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

.list-poke li span {
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

.list-poke li button {
  width: 44px;
  height: 44px;
}
</style>
