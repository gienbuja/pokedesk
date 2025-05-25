<script setup lang="ts">
// Importaciones de componentes y tipos
import BarPoke from '@/components/BottonBarPoke.vue';
// import LoaderIcon from '@/components/icons/LoaderIcon.vue';
import ListPoke from '@/components/ListPoke.vue';
import ModalPoke from '@/components/ModalPoke.vue';
import SearchPoke from '@/components/SearchPoke.vue';
import type { Pokemon } from '@/types';
import { computed, onMounted, ref } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.store';
import EmptyPoke from '@/components/EmptyPoke.vue';
import DynamicBackground from '@/components/DynamicBackground.vue';

// Variables reactivas
const loading = ref(0);
const inputSearch = ref('');
const allSelected = ref(true);
const pokemonDetails = ref<Pokemon | null>(null);
const allPokemons = ref<Array<Pokemon>>([]);
const favoritePokemons = ref<Array<Pokemon>>([]);

// Store de Pokémon
const pokemonStore = usePokemonStore();

/**
 * Simula el proceso de carga con un intervalo
 */
const simulateLoading = () => {
  const intervalId = setInterval(() => {
    loading.value += 10;
    if (loading.value >= 100) {
      loading.value = 100;
      clearInterval(intervalId);
    }
  }, 1200);
};

/**
 * Obtiene los detalles de un Pokémon específico
 * @param pokemon - Pokémon del cual obtener los detalles
 * @returns Detalles del Pokémon
 */
const fetchPokemonDetails = async (pokemon: Pokemon) => {
  try {
    const details = await pokemonStore.updatePokemonDetails(pokemon.url);
    return details;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Filtra los Pokémon según la búsqueda y selección
 * @returns Lista de Pokémon filtrados
 */
const pokemons = computed(() => {
  let filteredPokemons = allPokemons.value;

  if (inputSearch.value) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  }

  if (!allSelected.value) {
    filteredPokemons = filteredPokemons.filter(pokemon => pokemonStore.isFavorite(pokemon.name));
  }

  return filteredPokemons;
});

// Hook de ciclo de vida: cuando el componente se monta
onMounted(async () => {
  simulateLoading()
  favoritePokemons.value = await pokemonStore.getFavoritePokemonsWithDetails();
  await pokemonStore.loadPokemons();
  allPokemons.value = pokemonStore.pokemons;
  console.log(allPokemons.value);
})

/**
 * Alterna un Pokémon como favorito
 * @param pokemon - Pokémon a marcar/desmarcar como favorito
 */
function toggleFavorite(pokemon: Pokemon) {
  pokemonStore.toggleFavorite(pokemon.name);
}

/**
 * Maneja el clic en un Pokémon
 * @param pokemon - Pokémon seleccionado
 */
async function pokemonClick(pokemon: Pokemon) {
  const details = await fetchPokemonDetails(pokemon);
  if (details) {
    pokemonDetails.value = details;
  }
}

/**
 * Cierra el modal de detalles
 */
function closeModal() {
  pokemonDetails.value = null;
}

/**
 * Limpia los filtros de búsqueda
 */
function clearFilters() {
  inputSearch.value = '';
  allSelected.value = true;
}

</script>

<template>
  <!-- Transición para el loading -->
  <Transition name="fade">
    <div v-if="loading < 100" class="loading">
      <DynamicBackground :favoritePokemons />
    </div>
  </Transition>

  <!-- Transición para el contenido principal -->
  <Transition name="slide-fade">
    <div v-if="loading >= 100" class="index-container">
      <div class="index-view">
        <SearchPoke v-model="inputSearch" />
        <EmptyPoke v-if="pokemons.length == 0" @clear-filters="clearFilters" />
        <ListPoke v-else :pokemons="pokemons" @toggle-favorite="toggleFavorite" @pokemonClick="pokemonClick" />
      </div>
      <BarPoke v-model:allSelected="allSelected" />
    </div>
  </Transition>

  <!-- Modal de detalles del Pokémon -->
  <ModalPoke :pokemon="pokemonDetails" @close-modal="closeModal" @toggle-favorite="toggleFavorite" />
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.index-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100dvh);
  padding-top: 35px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
}

.index-view {
  height: calc(100dvh - 90px);
  max-width: 630px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  justify-content: center;
  gap: 40px;
  padding-right: 30px;
  padding-left: 30px;
}
</style>
