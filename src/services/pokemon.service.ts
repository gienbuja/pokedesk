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

  MAX_CACHE_ITEMS: 50,

  /**
   * Obtiene todos los Pokémon disponibles desde la API o caché
   * @returns {Promise<Pokemon[]>} Lista de Pokémon
   */
  fetchAllPokemons: async function (): Promise<Pokemon[]> {
    const cached = this.getFromCache(this.CACHE_KEY)
    if (cached) {
      // console.log('Pokémon obtenidos desde caché')
      return cached as Pokemon[]
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
   * Obtiene detalles de un Pokémon específico
   * @param {string} url - URL del Pokémon
   * @returns {Promise<Pokemon>} Detalles del Pokémon
   */
  fetchAndCachePokemonDetails: async function (url: string): Promise<Pokemon> {
    try {
      const pokemonName = this.extractPokemonNameFromUrl(url)

      // Primero buscar en caché
      const cachedData = this.getFromCache(pokemonName)
      if (cachedData) {
        return cachedData as Pokemon
      }

      // Si no está en caché, hacer la petición
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Error fetching Pokémon: ${url}`)

      const data = await response.json()
      const pokemonDetails = this.mapPokemonData(data)
      pokemonDetails.url = url
      // Guardar en caché
      this.saveToCache(pokemonName, pokemonDetails)

      return pokemonDetails
    } catch (error) {
      console.error('Error in fetchAndCachePokemonDetails:', error)
      throw error
    }
  },

  /**
   * Busca un Pokémon por nombre
   * @param {string} name - Nombre del Pokémon
   * @returns {Promise<Pokemon>} Detalles del Pokémon
   */
  getPokemonByName: async function (name: string): Promise<Pokemon> {
    const normalizedName = name.toLowerCase().trim()

    const cachedData = this.getFromCache(normalizedName)
    if (cachedData) {
      return cachedData as Pokemon
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

  /**
   * Mapea datos de la API a nuestro modelo
   * @param {Pokemon} data - Datos crudos de la API
   * @returns {Pokemon} Pokémon mapeado
   */
  mapPokemonData: function (data: Pokemon): Pokemon {
    return {
      id: data.id,
      name: data.name,
      sprites: data.sprites,
      types: data.types,
      height: data.height,
      weight: data.weight,
      url: data.url,
      cries: data.cries,
    }
  },

  /**
   * Obtiene datos de caché
   * @param {string} key - Clave de caché
   * @returns {Pokemon|Pokemon[]|null|string[]} Datos en caché o null
   */
  getFromCache: function (key: string): Pokemon | Pokemon[] | null | string[] {
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

  /**
   * Guarda datos en caché
   * @param {string} key - Clave de caché
   * @param {Pokemon|Pokemon[]|string[]} data - Datos a guardar
   * @returns {void}
   */
  saveToCache: function (key: string, data: Pokemon | Pokemon[] | string[]): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    try {
      localStorage.setItem(`pokemon_${key}`, JSON.stringify(cacheData))
    } catch (error) {
      // Si la caché está llena, limpiar y volver a intentar
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearCache()
        localStorage.setItem(`pokemon_${key}`, JSON.stringify(cacheData))
      }
    }
  },

  /**
   * Limipa la caché sin afectar la caché de favoritos
   * @returns {void}
   */
  clearCache(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('pokemon_') && key !== 'pokemon_favorites')
      .forEach((key) => localStorage.removeItem(key))
  },

  /**
   * Extrae el nombre del Pokémon de una URL
   * @param {string} url - URL del Pokémon
   * @returns {string} Nombre del Pokémon
   * @example
   * extractPokemonNameFromUrl('@example.com/pokemon/123/') // '123'
   */

  extractPokemonNameFromUrl: function (url: string): string {
    const matches = url.match(/\/pokemon\/([^\/]+)\/?$/)
    return matches ? matches[1].toLowerCase() : ''
  },

  /**
   * Guarda la lista de favoritos en el localStorage
   * @param favorites
   * @returns {void}
   */
  setFavorites(favorites: string[]): void {
    console.log('Guardando favoritos en localStorage:', favorites)
    this.saveToCache('favorites', favorites)
  },

  /**
   * Obtiene la lista de favoritos del localStorage
   * @returns {string[]} Lista de favoritos
   */
  getFavorites: function (): string[] {
    return (this.getFromCache('favorites') as string[]) || []
  },
}
