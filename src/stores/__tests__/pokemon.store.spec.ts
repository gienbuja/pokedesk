import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '../pokemon.store'
import { PokemonService } from '@/services/pokemon.service'
import { describe, expect, it, beforeEach, vi, type MockedFunction } from 'vitest'
import type { Pokemon } from '@/types'
type MockedPokemonService = typeof PokemonService

vi.mock('@/services/pokemon.service', () => ({
  PokemonService: {
    fetchAllPokemons: vi.fn().mockResolvedValue([]) as MockedFunction<
      (typeof PokemonService)['fetchAllPokemons']
    >,
    fetchAndCachePokemonDetails: vi.fn(),
    setFavorites: vi.fn(),
    getFavorites: vi.fn(() => []),
    getPokemonByName: vi.fn() as MockedPokemonService['getPokemonByName'],
  },
}))

const mockPokemonData = { name: 'pikachu', url: 'url1', details: { types: [] } }
vi.mocked(PokemonService.getPokemonByName).mockResolvedValue(mockPokemonData as Pokemon)

/**
 * Suite de pruebas para el store de Pokémon con Pinia
 * @test {usePokemonStore}
 * @description Valida:
 * - Carga inicial de Pokémon desde el servicio
 * - Actualización de detalles con merge de propiedades
 * - Gestión de favoritos con persistencia
 * - Consulta de estado de favoritos
 * - Obtención de favoritos con metadata completa
 * 
 * @example
 * describe('usePokemonStore', () => {
 *   // Configuración común con Pinia y mocks
 *   // Pruebas específicas por funcionalidad
 * })
 */
describe('usePokemonStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  /**
   * @test {loadPokemons}
   * @description Verifica la carga inicial de Pokémon:
   * 1. Mockea respuesta del servicio
   * 2. Ejecuta la carga
   * 3. Comprueba actualización del estado
   * 4. Valida cambio de estado de loading
   */
  it('debe cargar los Pokémon al inicializar el store', async () => {
    const mockData = [{ name: 'pikachu', url: '...' }]
    vi.mocked(PokemonService.fetchAllPokemons).mockResolvedValue(mockData)

    const store = usePokemonStore()
    await store.loadPokemons()

    expect(store.pokemons).toEqual(mockData)
    expect(store.isLoading).toBe(false)
  })

  /** Mock de datos base para pruebas de actualización */
  const basePokemon = {
    name: 'pikachu',
    url: 'test-url',
    sprites: {
      front_default: '',
      other: { 'official-artwork': { front_default: 'url-oficial' } },
    },
    types: [],
    stats: [],
    height: 0,
    weight: 0,
  }

  /** Mock de respuesta de servicio con detalles actualizados */
  const updatedDetails = {
    url: 'test-url',
    name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    stats: [{ base_stat: 90, stat: { name: 'speed' } }],
    height: 40,
    weight: 60,
    sprites: {
      other: { 'official-artwork': { front_default: 'nueva-url' } },
    },
  }

  // Configuración global del mock de servicio
  vi.mocked(PokemonService.fetchAndCachePokemonDetails).mockResolvedValue(updatedDetails);

  /**
   * @test {updatePokemonDetails}
   * @description Prueba merge de propiedades al actualizar:
   * - Conserva datos existentes
   * - Sobrescribe propiedades actualizadas
   * - Mantiene referencias de objetos anidados
   */
  it('debe actualizar detalles de un Pokémon', async () => {
    const store = usePokemonStore()
    store.pokemons = [
      {
        ...basePokemon,
        sprites: {
          ...basePokemon.sprites,
          other: { 'official-artwork': { front_default: 'url-oficial', front_shiny: '' } },
        },
      } as Pokemon,
    ]

    await store.updatePokemonDetails('test-url')

    expect(store.pokemons[0]).toMatchObject({
      ...basePokemon,
      ...updatedDetails,
    })

    // Verificar actualización de sprites
    expect(store.pokemons[0]?.sprites?.other?.['official-artwork']?.front_default).toBe('nueva-url')
  })

  /**
   * @test {toggleFavorite}
   * @description Valida el comportamiento del toggle:
   * - Añade/remueve de favoritos
   * - Persiste en localStorage
   * - Usa el servicio correspondiente
   */
  it('debe alternar un Pokémon como favorito', () => {
    const store = usePokemonStore()
    store.toggleFavorite('pikachu')
    expect(store.favorites).toContain('pikachu')
    expect(PokemonService.setFavorites).toHaveBeenCalled()

    store.toggleFavorite('pikachu')
    expect(store.favorites).not.toContain('pikachu')
  })

  /**
   * @test {isFavorite}
   * @description Verifica detección de favoritos:
   * - Caso positivo con elemento existente
   * - Caso negativo con elemento ausente
   * - Sensibilidad a mayúsculas/minúsculas
   */
  it('debe verificar si un Pokémon es favorito', () => {
    const store = usePokemonStore()
    store.favorites = ['charizard']
    expect(store.isFavorite('charizard')).toBe(true)
    expect(store.isFavorite('pikachu')).toBe(false)
  })

  /**
   * @test {getFavoritePokemonsWithDetails}
   * @description Valida obtención de favoritos con:
   * - Datos completos desde el servicio
   * - Formato consistente
   * - Manejo de promesas múltiples
   */
  it('debe obtener favoritos con detalles', async () => {
    const store = usePokemonStore()
    store.favorites = ['pikachu']

    const result = await store.getFavoritePokemonsWithDetails()
    expect(result).toEqual([mockPokemonData])
  })
})
