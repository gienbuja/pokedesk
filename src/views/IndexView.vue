<script setup lang="ts">
import BarPoke from '@/components/BottonBarPoke.vue';
import LoaderIcon from '@/components/icons/LoaderIcon.vue';
import ListPoke from '@/components/ListPoke.vue';
import ModalPoke from '@/components/ModalPoke.vue';
import SearchPoke from '@/components/SearchPoke.vue';
import type { Pokemon } from '@/types';
import { computed, onMounted, ref } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.store';

const loading = ref(0);
const inputSearch = ref('');
const allSelected = ref(true);
const pokemonDetails = ref<Pokemon | null>(null);
const allPokemons = ref<Array<Pokemon>>([]);

const pokemonStore = usePokemonStore();

const simulateLoading = () => {
  const interval = setInterval(() => {
    if (loading.value < 100) {
      loading.value += Math.floor(Math.random() * 10) + 1;
      if (loading.value > 100) {
        loading.value = 100;
      }
    } else {
      clearInterval(interval);
    }
  }, 200);
};

const fetchPokemonDetails = async (pokemon: Pokemon) => {
  try {
    const details = await pokemonStore.updatePokemonDetails(pokemon.url);
    return details;
  } catch (error) {
    console.error('Error:', error);
  }
};

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

onMounted(async () => {
  simulateLoading()
  await pokemonStore.loadPokemons();
  allPokemons.value = pokemonStore.pokemons;
})

function toggleFavorite(pokemon: Pokemon) {
  pokemonStore.toggleFavorite(pokemon.name);
}

async function pokemonClick(pokemon: Pokemon) {
  const details = await fetchPokemonDetails(pokemon);
  if (details) {
    pokemonDetails.value = details;
  }
}

function closeModal() {
  pokemonDetails.value = null;
}

</script>

<template>
  <div v-if="loading < 100" class="loading">
    <LoaderIcon />
    <div v-if="loading > 0 && loading < 100">
      Cargando: {{ loading }}%
    </div>
  </div>
  <div v-else class="index-container">
    <div class="index-view">
      <SearchPoke v-model="inputSearch" />
      <ListPoke :pokemons="pokemons" @toggle-favorite="toggleFavorite" @pokemonClick="pokemonClick" />
    </div>
    <BarPoke v-model:allSelected="allSelected" />
  </div>
  <ModalPoke :pokemon="pokemonDetails" @close-modal="closeModal" @toggle-favorite="toggleFavorite" />
</template>

<style scoped>
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
