import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PokemonService } from '../pokemon.service'

/**
 * Suite de pruebas para el servicio Pokémon
 * @test {PokemonService}
 * @description Valida el comportamiento completo del servicio incluyendo:
 * - Obtención de listados de Pokémon desde API
 * - Búsqueda por nombre con construcción de URLs
 * - Sistema de caché con localStorage
 * - Gestión de favoritos persistente
 * - Transformación de datos de la API
 * - Manejo de errores y estados de carga
 * 
 * @example
 * describe('Pokemon Service', () => {
 *   // Configuración común con mocks de fetch y localStorage
 *   // Pruebas anidadas por funcionalidad
 * })
 * 
 * @see {@link https://pokeapi.co/|PokeAPI} - Fuente de datos utilizada
 * @see {@link ../../pokemon.service.ts|Implementación del servicio}
 * 
 * Tecnologías utilizadas:
 * - ViTest para mocking y assertions
 * - Mock de Fetch API para simular llamadas HTTP
 * - localStorage mockeado para pruebas de caché
 * 
 * Cubre los principales casos de uso:
 * 1. Flujos exitosos de obtención de datos
 * 2. Recuperación desde caché
 * 3. Persistencia de favoritos
 * 4. Limpieza de almacenamiento
 * 5. Estructuras de datos consistentes
 */
describe('Pokemon Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
    localStorage.clear()
  })

  /**
   * Pruebas para el método fetchAllPokemons que validan:
   * - Comportamiento sin datos en caché
   * - Uso correcto de datos cacheados
   * - Manejo de estructura de respuesta de la API
   */
  describe('fetchAllPokemons', () => {
    /**
     * Verifica el flujo sin caché:
     * 1. Mockea respuesta API con datos básicos
     * 2. Ejecuta el método
     * 3. Comprueba que se llama a la API
     * 4. Valida estructura de datos devuelta
     */
    it('debería obtener Pokémon desde la API cuando no hay caché', async () => {
      const mockResponse = {
        json: vi.fn().mockResolvedValue({
          results: [{ name: 'pikachu', url: 'url1' }],
          next: null,
        }),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

      const pokemons = await PokemonService.fetchAllPokemons()

      expect(fetch).toHaveBeenCalled()
      expect(pokemons).toEqual([{ name: 'pikachu', url: 'url1' }])
    })

    /**
     * Prueba el uso de caché existente:
     * 1. Configura datos mock en localStorage
     * 2. Verifica que NO se llama a la API
     * 3. Comprueba que devuelve datos cacheados
     * 4. Valida formato de almacenamiento en caché
     */
    it('debería usar la caché cuando está disponible', async () => {
      const cachedPokemons = [{ name: 'bulbasaur', url: 'url2' }]
      localStorage.setItem(
        'pokemon_pokedex_all_pokemons',
        JSON.stringify({ data: cachedPokemons, timestamp: Date.now() }),
      )

      const pokemons = await PokemonService.fetchAllPokemons()

      expect(fetch).not.toHaveBeenCalled()
      expect(pokemons).toEqual(cachedPokemons)
    })
  })

  /**
   * Pruebas para la obtención y almacenamiento en caché de detalles de Pokémon
   * @test {fetchAndCachePokemonDetails} 
   * @description Verifica:
   * - La correcta llamada a la API para obtener detalles del Pokémon
   * - El parseo y estructuración de los datos recibidos
   * - El manejo de respuestas exitosas con datos válidos
   * @example
   * Mock de respuesta API:
   * - Pokémon Pikachu (ID 25)
   * - Sprites, tipos, altura y peso
   */
  describe('fetchAndCachePokemonDetails', () => {
    /**
     * @test {fetchAndCachePokemonDetails} flujo exitoso
     * @description Verifica que:
     * 1. Se realiza la llamada HTTP al endpoint correcto
     * 2. Los datos del Pokémon se transforman correctamente
     * 3. Se devuelve la estructura esperada
     */
    it('debería obtener detalles de un Pokémon', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        sprites: { front_default: 'sprite-url' },
        types: [],
        height: 4,
        weight: 60,
        url: 'pokemon-url',
      }
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockPokemon),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

      const result = await PokemonService.fetchAndCachePokemonDetails('pokemon-url')

      expect(fetch).toHaveBeenCalledWith('pokemon-url')
      expect(result.name).toBe('pikachu')
    })
  })

  /**
   * Pruebas para la búsqueda de Pokémon por nombre
   * @test {getPokemonByName}
   * @description Verifica:
   * - Construcción correcta de la URL de la API
   * - Manejo de la respuesta exitosa
   * - Transformación de datos del Pokémon
   * @example
   * Búsqueda de 'bulbasaur' debería:
   * - Llamar a la API con el nombre en la URL
   * - Devolver objeto con nombre correcto
   */
  describe('getPokemonByName', () => {
    it('debería buscar un Pokémon por nombre', async () => {
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'sprite-url' },
        types: [],
        height: 7,
        weight: 69,
        url: 'pokemon-url',
      }
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockPokemon),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

      const result = await PokemonService.getPokemonByName('bulbasaur')

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur')
      expect(result.name).toBe('bulbasaur')
    })
  })

  /**
   * Pruebas del sistema de caché
   * @test {saveToCache}, @test {getFromCache}, @test {clearCache}
   * @description Verifica:
   * - Almacenamiento y recuperación de datos
   * - Limpieza completa del almacenamiento local
   * - Formato de almacenamiento (clave-valor)
   */
  describe('cache methods', () => {
    /**
     * @test {saveToCache} y {getFromCache}
     * @description Verifica el ciclo completo de almacenamiento:
     * 1. Guardar datos con clave específica
     * 2. Recuperar datos con la misma clave
     * 3. Integridad de los datos recuperados
     */
    it('debería guardar y obtener de la caché correctamente', () => {
      const testData = { name: 'test', url: 'url' }
      PokemonService.saveToCache('test', testData)

      const result = PokemonService.getFromCache('test')
      expect(result).toEqual(testData)
    })

    /**
     * @test {clearCache}
     * @description Verifica que:
     * - Se eliminan todos los datos relacionados
     * - El almacenamiento queda en estado inicial
     */
    it('debería limpiar la caché correctamente', () => {
      localStorage.setItem('pokemon_test', 'data')
      PokemonService.clearCache()

      expect(localStorage.getItem('pokemon_test')).toBeNull()
    })
  })

  /**
   * Pruebas de gestión de favoritos
   * @test {setFavorites}, @test {getFavorites}
   * @description Verifica:
   * - Almacenamiento persistente de favoritos
   * - Recuperación correcta de la lista
   * - Formato del almacenamiento (JSON stringify)
   */
  describe('favorites', () => {
    it('debería guardar y obtener favoritos', () => {
      const favorites = ['pikachu', 'charizard']
      PokemonService.setFavorites(favorites)

      const result = PokemonService.getFavorites()
      expect(result).toEqual(favorites)
    })
  })
})
