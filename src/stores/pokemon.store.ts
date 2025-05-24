import { defineStore } from 'pinia'
import { PokemonService } from '@/services/pokemon.service'
import type { Pokemon } from '@/types'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    isLoading: false,
    favorites: JSON.parse(localStorage.getItem('pokemon_favorites') || '[]') as string[],
  }),

  actions: {
    async loadPokemons() {
      this.isLoading = true
      try {
        this.pokemons = await PokemonService.fetchAllPokemons()
      } finally {
        this.isLoading = false
      }
    },

    async updatePokemonDetails(pokemonUrl: string) {
      const data = await PokemonService.fetchAndCachePokemonDetails(pokemonUrl)

      const index = this.pokemons.findIndex((p) => p.url === pokemonUrl)
      if (index !== -1) {
        this.pokemons[index] = { ...this.pokemons[index], ...data }
      }

      return data
    },

    updatePokemonInStore(pokemonUrl: string, data: Pokemon) {
      const index = this.pokemons.findIndex((p) => p.url === pokemonUrl)
      if (index !== -1) {
        this.pokemons[index] = { ...this.pokemons[index], ...data }
      }
    },

    toggleFavorite(pokemonName: string) {
      const index = this.favorites.indexOf(pokemonName)

      if (index === -1) {
        this.favorites.push(pokemonName)
      } else {
        this.favorites.splice(index, 1)
      }

      localStorage.setItem('pokemon_favorites', JSON.stringify(this.favorites))
    },

    isFavorite(pokemonName: string): boolean {
      return this.favorites.includes(pokemonName)
    },
  },
})
