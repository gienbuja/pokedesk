import type { Pokemon } from '@/types'

/**
 * Servicio para manejar las operaciones relacionadas con la API de Pokémon
 * Incluye caché local para mejorar el rendimiento
 */
export const PokemonService = {
  /** Clave para almacenar la lista completa de Pokémon en caché */
  CACHE_KEY: 'pokedex_all_pokemons',

  /** Tiempo de expiración de la caché (24 horas en milisegundos) */
  CACHE_EXPIRATION: 24 * 60 * 60 * 1000,

  /** Clave para almacenar los detalles de Pokémon en caché */
  CACHE_DETAILS_KEY: 'pokedex_pokemon_details',

  /**
   * Obtiene todos los Pokémon disponibles desde la API
   * @returns Promise con la lista de Pokémon
   * @description Maneja caché local y paginación automática
   */
  fetchAllPokemons: async function () {
    const cached = this.getFromCache(this.CACHE_KEY)
    if (cached) {
      console.log('Pokémon obtenidos desde caché')
      return cached
    }

    let allPokemons: Pokemon[] = []
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon'

    while (nextUrl) {
      const response = await fetch(nextUrl)
      const data = await response.json()
      allPokemons = [...allPokemons, ...data.results]
      nextUrl = data.next
    }

    this.saveToCache(this.CACHE_KEY, allPokemons)

    return allPokemons
  },

  /**
   * Obtiene los detalles de un Pokémon específico desde la API
   * @param url - URL del Pokémon a consultar
   * @returns Promise con los detalles del Pokémon
   * @description Maneja caché local para evitar peticiones repetidas
   */
  fetchAndCachePokemonDetails: async function (url: string) {
    try {
      // Extraer nombre de Pokémon de la URL para usar como clave de caché
      const pokemonName = this.extractPokemonNameFromUrl(url)

      // Primero buscar en caché
      const cachedData = this.getFromCache(pokemonName)
      if (cachedData) {
        return cachedData
      }

      // Si no está en caché, hacer la petición
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Error fetching Pokémon: ${url}`)

      const data = await response.json()
      const pokemonDetails = this.mapPokemonData(data)

      // Guardar en caché
      this.saveToCache(pokemonName, pokemonDetails)

      return pokemonDetails
    } catch (error) {
      console.error('Error in fetchAndCachePokemonDetails:', error)
      throw error
    }
  },

  getPokemonByName: async function (name: string) {
    const normalizedName = name.toLowerCase().trim()

    const cachedData = this.getFromCache(normalizedName)
    if (cachedData) {
      return cachedData
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`)
      if (!response.ok) throw new Error(`Pokémon not found: ${name}`)

      const data = await response.json()
      const pokemonDetails = this.mapPokemonData(data)

      this.saveToCache(normalizedName, pokemonDetails)

      return pokemonDetails
    } catch (error) {
      console.error(`Error getting Pokémon ${name}:`, error)
      throw error
    }
  },

  mapPokemonData: function (data: Pokemon): Pokemon {
    return {
      id: data.id,
      name: data.name,
      sprites: data.sprites,
      types: data.types,
      height: data.height,
      weight: data.weight,
      url: data.url,
    }
  },

  getFromCache: function (key: string) {
    const cached = localStorage.getItem(`pokemon_${key}`)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`pokemon_${key}`)
      return null
    }

    return data
  },

  saveToCache: function (key: string, data: Pokemon | Pokemon[]) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(`pokemon_${key}`, JSON.stringify(cacheData))
  },

  clearCache: function () {
    // Limpiar solo las keys de Pokémon
    Object.keys(localStorage)
      .filter((key) => key.startsWith('pokemon_'))
      .forEach((key) => localStorage.removeItem(key))
  },

  extractPokemonNameFromUrl: function (url: string): string {
    const matches = url.match(/\/pokemon\/([^\/]+)\/?$/)
    return matches ? matches[1].toLowerCase() : ''
  },
  /**
   * Actualiza la caché de detalles de un Pokémon específico
   * @param url - URL del Pokémon a actualizar
   * @param data - Nuevos datos del Pokémon
   */
  updatePokemonCache: function (url: string, data: Pokemon) {
    const cachedDetails = localStorage.getItem(this.CACHE_DETAILS_KEY)
    const cachedData = cachedDetails ? JSON.parse(cachedDetails) : {}

    cachedData[url] = data
    localStorage.setItem(this.CACHE_DETAILS_KEY, JSON.stringify(cachedData))
  },
}
