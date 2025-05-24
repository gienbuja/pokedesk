<template>
  <div v-if="pokemon" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">
        <CloseIcon />
      </button>

      <div class="pokemon-details">
        <BackgroundPoke></BackgroundPoke>
        <span class="image-container">
          <img :src="pokemon.sprites.other['official-artwork'].front_shiny" alt="pokemon image">
        </span>
        <ul>
          <li>
            <span>
              Name:
            </span>
            <span>
              {{ pokemon.name }}
            </span>
          </li>
          <li>
            <span>
              Weight:
            </span>
            <span>
              {{ pokemon.weight }}
            </span>
          </li>
          <li>
            <span>
              Height:
            </span>
            <span>
              {{ pokemon.height }}
            </span>
          </li>
          <li>
            <span>
              Types:
            </span>
            <span>
              {{pokemon.types.map(type => type.type.name).join(', ')}}
            </span>
          </li>
        </ul>
        <span class="footer-modal">
          <BtnPoke label="Share to my friends"></BtnPoke>
          <button @click.stop="handleToggleFavorite(pokemon)">
            <FavoriteRoundedIcon :favorite="pokemon.favorite" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonList } from '@/types';
import CloseIcon from './icons/CloseIcon.vue';
import BackgroundPoke from './BackgroundPoke.vue';
import BtnPoke from './BtnPoke.vue';
import FavoriteRoundedIcon from './icons/FavoriteRoundedIcon.vue';


defineProps<{
  pokemon: PokemonList | null
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void,
  (e: 'toggleFavorite', pokemon: PokemonList): void,
}>();

const closeModal = () => {
  emit('closeModal');
}
const handleToggleFavorite = (pokemon: PokemonList) => {
  emit('toggleFavorite', pokemon);
}
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

.image-container {
  width: 100%;
  height: 180px;
  position: absolute;
  top: 20px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pokemon-details ul {
  list-style: none;
  padding: 20px;
  margin: 0;
}

.pokemon-details ul li {
  border-bottom: 1px solid #E8E8E8;
  padding: 10px 0;
}

.pokemon-details ul li span {
  font-family: Lato;
  font-weight: 700;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0%;
  height: 27px;
}

.pokemon-details ul li span:last-child {
  font-family: Lato;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0%;
  text-transform: capitalize;
  height: 27px;
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
