import type { Pokemon } from '@/types'

export const PokemonService = {
  CACHE_KEY: 'pokedex_all_pokemons',
  CACHE_EXPIRATION: 24 * 60 * 60 * 1000,
  fetchAllPokemons: async function () {
    // Verificar caché primero
    const cached = localStorage.getItem(this.CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < this.CACHE_EXPIRATION) {
        return data
      }
    }

    // Obtener todos los Pokémon (manejo de paginación)
    let allPokemons: Pokemon[] = []
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon'

    while (nextUrl) {
      const response = await fetch(nextUrl)
      const data = await response.json()
      allPokemons = [...allPokemons, ...data.results]
      nextUrl = data.next
    }

    // Guardar en caché
    localStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify({
        data: allPokemons,
        timestamp: Date.now(),
      }),
    )

    return allPokemons
  },
  CACHE_DETAILS_KEY: 'pokedex_pokemon_details',
  fetchAndCachePokemonDetails: async function (url: string) {
    const cachedDetails = localStorage.getItem(this.CACHE_DETAILS_KEY)
    const cachedData = cachedDetails ? JSON.parse(cachedDetails) : {}

    if (cachedData[url]) {
      return cachedData[url]
    }

    const response = await fetch(url)
    const data = await response.json()

    cachedData[url] = data
    localStorage.setItem(this.CACHE_DETAILS_KEY, JSON.stringify(cachedData))

    return data
  },

  updatePokemonCache: function (url: string, data: Pokemon) {
    const cachedDetails = localStorage.getItem(this.CACHE_DETAILS_KEY)
    const cachedData = cachedDetails ? JSON.parse(cachedDetails) : {}

    cachedData[url] = data
    localStorage.setItem(this.CACHE_DETAILS_KEY, JSON.stringify(cachedData))
  },
}
