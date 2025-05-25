import type { Ref } from 'vue'

/**
 * Reproduce el grito de un Pokémon desde una API externa
 * @param {number} pokemonId - ID del Pokémon cuyo grito se reproducirá
 * @returns {Promise<void>} No retorna valor pero puede lanzar errores
 * @throws {Error} Cuando falla la petición HTTP o la reproducción
 */
export const playPokemonCry = async (pokemonId: number): Promise<void> => {
  try {
    const response = await fetch(`https://pokedex-api-sounds.onrender.com/sound/${pokemonId}`)
    if (!response.ok) throw new Error('Sonido no encontrado')
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    audio.play()
  } catch (error) {
    console.error('Error:', error)
  }
}

/**
 * Simula una carga progresiva actualizando una referencia reactiva
 * @param {Ref<number>} loadingRef - Referencia reactiva que almacena el progreso (0-100)
 * @returns {void} No retorna valor
 * @description Incrementa el valor cada 1.2 segundos hasta llegar a 100
 */
export const simulateLoading = (loadingRef: Ref<number>): void => {
  const intervalId = setInterval(() => {
    loadingRef.value += 10
    if (loadingRef.value >= 100) {
      loadingRef.value = 100
      clearInterval(intervalId)
    }
  }, 1200)
}
