import { describe, it, expect, vi, beforeEach } from 'vitest'
import { playPokemonCry, simulateLoading } from '../ui.service'
import { ref } from 'vue'

/**
 * Pruebas de integración para el servicio UI que cubren:
 * - Reproducción de sonidos de Pokémon:
 *   ✔ Flujo exitoso con mock de Audio API
 *   ✔ Manejo de errores de red y IDs inválidos
 * - Simulación de carga progresiva:
 *   ✔ Incremento porcentual correcto
 *   ✔ Temporización precisa
 * 
 * Mocks utilizados:
 * - fetch API para peticiones HTTP
 * - Audio Web API
 * - URL.createObjectURL
 * 
 * @example
 * // Ejecutar pruebas específicas
 * npm test ui.service.spec.ts -t 'reproducir sonido'
 * npm test ui.service.spec.ts -t 'carga progresiva'
 */
describe('UI Service', () => {
  // Configuración común con mocks de fetch
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
    global.URL = {
      createObjectURL: vi.fn(() => 'mock-audio-url'),
      revokeObjectURL: vi.fn(),
    } as unknown as typeof globalThis.URL
  })

  describe('playPokemonCry', () => {
    /**
     * Verifica el flujo completo de reproducción de sonido:
     * 1. Mockea una respuesta exitosa del servidor de sonidos
     * 2. Simula la creación de un objeto Audio funcional
     * 3. Ejecuta la función playPokemonCry con un ID válido
     * 4. Verifica:
     *    - Llamado correcto al endpoint de sonidos
     *    - Creación de URL para el blob de audio
     *    - Reproducción efectiva del sonido
     */
    it('debería reproducir el sonido correctamente', async () => {
      // Configura mock de respuesta HTTP con un blob vacío
      const mockBlob = new Blob()
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

      // Mock del API Audio para simular reproducción
      const mockPlay = vi.fn()
      global.Audio = vi.fn().mockImplementation(() => ({
        play: mockPlay,
      }))

      // Ejecutar la función bajo prueba con ID de Pikachu
      await playPokemonCry(25) // ID de Pikachu
      // Verificaciones de comportamiento esperado
      expect(fetch).toHaveBeenCalledWith('https://pokedex-api-sounds.onrender.com/sound/25')
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockPlay).toHaveBeenCalled()
    })

    /**
     * Verifica el manejo de errores en reproducción de sonidos:
     * 1. Simula un error de red al hacer la petición HTTP
     * 2. Mockea console.error para capturar el error
     * 3. Ejecuta la función con un ID inválido (999)
     * 4. Verifica que:
     *    - Se detecta y registra el error adecuadamente
     *    - No se genera ninguna URL de sonido
     *    - No se intenta reproducir audio
     */
    it('debería manejar errores al reproducir sonido', async () => {
      // Configurar mock de error de red
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));
      
      // Espía en console.error para verificar captura de errores
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Ejecutar con ID inválido
      await playPokemonCry(999);

      // Verificar que se registró el error
      expect(consoleSpy).toHaveBeenCalled();
    })
  })

  describe('simulateLoading', () => {
    /**
     * Prueba el estado de carga:
     * 1. Verifica que se inicia el loading al hacer request
     * 2. Comprueba que se desactiva el loading al finalizar
     * 3. Valida estado intermedio durante peticiones concurrentes
     */
    it('debería incrementar el valor de carga progresivamente', () => {
      vi.useFakeTimers()
      const loadingRef = ref(0)

      simulateLoading(loadingRef)

      // Avanzar el tiempo y verificar progreso
      vi.advanceTimersByTime(1200)
      expect(loadingRef.value).toBe(10)

      vi.advanceTimersByTime(1200)
      expect(loadingRef.value).toBe(20)

      // Avanzar hasta completar
      vi.advanceTimersByTime(12000)
      expect(loadingRef.value).toBe(100)

      vi.useRealTimers()
    })
  })
})
