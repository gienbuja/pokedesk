<template>
  <div v-if="pokemon" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">
        <CloseIcon />
      </button>

      <div class="pokemon-details">
        <BackgroundPoke />
        <PokemonImage :pokemon="pokemon" />
        <PokemonDetailsList :pokemon="pokemon" />

        <span class="footer-modal">
          <BtnPoke label="Share to my friends" />
          <button @click.stop="handleToggleFavorite(pokemon)">
            <FavoriteRoundedIcon :favorite="isFavorite(pokemon)" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '@/types';
import CloseIcon from './icons/CloseIcon.vue';
import BackgroundPoke from './BackgroundPoke.vue';
import PokemonImage from './PokemonImage.vue';
import PokemonDetailsList from './PokemonDetailsList.vue';
import BtnPoke from './BtnPoke.vue';
import FavoriteRoundedIcon from './icons/FavoriteRoundedIcon.vue';
import { usePokemonStore } from '@/stores/pokemon.store';

const pokemonStore = usePokemonStore()


defineProps<{
  pokemon: Pokemon | null
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'toggleFavorite', pokemon: Pokemon): void,
}>();

const closeModal = () => {
  emit('closeModal');
}
const handleToggleFavorite = (pokemon: Pokemon) => {
  emit('toggleFavorite', pokemon);
}

const isFavorite = (pokemon: Pokemon) => {
  return pokemonStore.isFavorite(pokemon.name);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 5px;
  max-width: 570px;
  position: relative;
  width: 100%;
  height: 506px;
}

@media screen and (max-width: 768px) {
  .modal-content {
    max-width: 315px;
  }
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  z-index: 10;
}

.pokemon-details {
  text-align: left;
}

.footer-modal {
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 44px;
  gap: 10px;
}
</style>
