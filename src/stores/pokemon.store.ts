import { defineStore } from 'pinia'
import { PokemonService } from '@/services/pokemon.service'
import type { Pokemon } from '@/types'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    isLoading: false,
    favorites: PokemonService.getFavorites(),
  }),

  actions: {
    /**
     * Carga todos los Pokémon desde la API o caché
     * @returns {Promise<void>}
     */
    async loadPokemons(): Promise<void> {
      this.isLoading = true
      try {
        this.pokemons = await PokemonService.fetchAllPokemons()
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Actualiza los detalles de un Pokémon específico
     * @param {string} pokemonUrl - URL del Pokémon
     * @returns {Promise<Pokemon>} Pokémon actualizado
     */
    async updatePokemonDetails(pokemonUrl: string): Promise<Pokemon> {
      this.isLoading = true
      const data = await PokemonService.fetchAndCachePokemonDetails(pokemonUrl)
      const index = this.pokemons.findIndex((p) => p.url === pokemonUrl)
      if (index !== -1) {
        this.pokemons[index] = { ...this.pokemons[index], ...data }
      }
      this.isLoading = false
      return data
    },

    /**
     * Alterna el estado de favorito de un Pokémon
     * @param {string} pokemonName - Nombre del Pokémon
     */
    toggleFavorite(pokemonName: string): void {
      const index = this.favorites.indexOf(pokemonName)
      if (index === -1) {
        this.favorites.push(pokemonName)
      } else {
        this.favorites.splice(index, 1)
      }
      PokemonService.setFavorites(this.favorites)
    },

    /**
     * Verifica si un Pokémon es favorito
     * @param {string} pokemonName - Nombre del Pokémon
     * @returns {boolean} true si es favorito
     */
    isFavorite(pokemonName: string): boolean {
      return this.favorites.includes(pokemonName)
    },

    /**
     * Obtiene los Pokémon favoritos con sus detalles completos
     * @returns {Promise<Pokemon[]>} Lista de Pokémon favoritos
     */
    async getFavoritePokemonsWithDetails(): Promise<Pokemon[]> {
      this.isLoading = true
      const favoritePokemons: Pokemon[] = []

      for (const namePokemon of this.favorites) {
        try {
          favoritePokemons.push(await PokemonService.getPokemonByName(namePokemon))
        } catch (error) {
          console.error(`Error obteniendo ${namePokemon}:`, error)
        }
      }
      this.isLoading = false
      return favoritePokemons
    },
  },
})
