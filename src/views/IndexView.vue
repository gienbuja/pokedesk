<script setup lang="ts">
import BarPoke from '@/components/BarPoke.vue';
import LoaderIcon from '@/components/icons/LoaderIcon.vue';
import ListPoke from '@/components/ListPoke.vue';
import SearchPoke from '@/components/SearchPoke.vue';
import type { PokemonList } from '@/types';
import { computed, onMounted, ref } from 'vue';
const loading = ref(0);
const inputSearch = ref('');
const allSelected = ref(true);

const allPokemons = ref<Array<PokemonList>>([]);

const fetchAllPokemons = async () => {
  try {
    let url = 'https://pokeapi.co/api/v2/pokemon';

    while (url) {
      const response = await fetch(url);
      const data = await response.json();

      // Inicializar cada Pokémon con favorite: false
      allPokemons.value = [
        ...allPokemons.value,
        ...data.results.map((pokemon: { name: string, url: string }) => ({
          ...pokemon,
          favorite: false // Inicializar como no favorito por defecto
        }))
      ];

      // Calcular porcentaje basado en count
      if (data.count) {
        loading.value = Math.min(
          Math.round((allPokemons.value.length / data.count) * 100),
          100
        );
      }

      url = data.next; // Continuar con la siguiente página
    }

  } catch (error) {
    console.error('Error:', error);
    loading.value = -1; // Indicar error
  }
};

const pokemons = computed(() => {
  let filteredPokemons = allPokemons.value;

  // Filtrar por búsqueda si hay texto
  if (inputSearch.value) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
  }

  // Filtrar por favoritos si allSelected es false
  if (!allSelected.value) {
    filteredPokemons = filteredPokemons.filter(pokemon => pokemon.favorite);
  }

  return filteredPokemons;
});

onMounted(() => {
  fetchAllPokemons();
})

function toggleFavorite(pokemon: PokemonList) {
  console.log(pokemon);
  const index = allPokemons.value.findIndex(p => p.name === pokemon.name);
  if (index !== -1) {
    allPokemons.value[index].favorite = !allPokemons.value[index].favorite;
  }
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
      <ListPoke v-model:pokemons="pokemons" @toggle-favorite="toggleFavorite" />
    </div>
    <BarPoke v-model:allSelected="allSelected" />
  </div>
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
