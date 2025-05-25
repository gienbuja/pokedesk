import { defineStore } from 'pinia'
import { PokemonService } from '@/services/pokemon.service'
import type { Pokemon } from '@/types'

/**
 * Store para manejar el estado y las acciones relacionadas con los Pokémon
 */
export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    /** Lista de Pokémon cargados */
    pokemons: [] as Pokemon[],
    /** Indica si se están cargando los Pokémon */
    isLoading: false,
    /** Lista de nombres de Pokémon favoritos */
    favorites: JSON.parse(localStorage.getItem('pokemon_favorites') || '[]') as string[],
  }),

  actions: {
    /**
     * Carga todos los Pokémon desde el servicio
     */
    async loadPokemons() {
      this.isLoading = true
      try {
        this.pokemons = await PokemonService.fetchAllPokemons()
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Actualiza los detalles de un Pokémon específico
     * @param pokemonUrl - URL del Pokémon a actualizar
     * @returns Detalles actualizados del Pokémon
     */
    async updatePokemonDetails(pokemonUrl: string) {
      this.isLoading = true
      const data = await PokemonService.fetchAndCachePokemonDetails(pokemonUrl)

      const index = this.pokemons.findIndex((p) => p.url === pokemonUrl)
      if (index !== -1) {
        this.pokemons[index] = { ...this.pokemons[index], ...data }
      }
      this.isLoading = false
      return data
    },

    // /**
    //  * Actualiza un Pokémon en el store con nuevos datos
    //  * @param pokemonUrl - URL del Pokémon a actualizar
    //  * @param data - Nuevos datos del Pokémon
    //  */
    // updatePokemonInStore(pokemonUrl: string, data: Pokemon) {
    //   const index = this.pokemons.findIndex((p) => p.url === pokemonUrl)
    //   if (index !== -1) {
    //     this.pokemons[index] = { ...this.pokemons[index], ...data }
    //   }
    // },

    /**
     * Alterna un Pokémon como favorito
     * @param pokemonName - Nombre del Pokémon a marcar/desmarcar como favorito
     */
    toggleFavorite(pokemonName: string) {
      const index = this.favorites.indexOf(pokemonName)

      if (index === -1) {
        this.favorites.push(pokemonName)
      } else {
        this.favorites.splice(index, 1)
      }

      localStorage.setItem('pokemon_favorites', JSON.stringify(this.favorites))
    },

    /**
     * Verifica si un Pokémon es favorito
     * @param pokemonName - Nombre del Pokémon a verificar
     * @returns true si el Pokémon es favorito, false en caso contrario
     */
    isFavorite(pokemonName: string): boolean {
      return this.favorites.includes(pokemonName)
    },

    /**
     * Obtiene la lista de Pokémon favoritos con sus detalles completos
     * @returns Promise con la lista de Pokémon favoritos y sus detalles
     */
    async getFavoritePokemonsWithDetails(): Promise<Pokemon[]> {
      this.isLoading = true
      const favoritePokemons: Pokemon[] = []

      // Obtener los detalles de cada Pokémon favorito
      for (const namePokemon of this.favorites) {
        try {
          const details = await PokemonService.getPokemonByName(namePokemon)
          favoritePokemons.push(details)
        } catch (error) {
          console.error(`Error obteniendo detalles de ${namePokemon}:`, error)
        }
      }
      this.isLoading = false
      return favoritePokemons
    },
  },
})
