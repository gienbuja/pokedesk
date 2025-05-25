<script setup lang="ts">
import { onMounted, ref } from 'vue'

const backgroundAudio = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  if (backgroundAudio.value) {
    backgroundAudio.value.volume = 0.1
    backgroundAudio.value.play().catch(error => {
      console.log('La reproducción automática fue bloqueada:', error)
    })
  }
})
</script>

<template>
  <audio ref="backgroundAudio" loop>
    <source src="/assets/sounds/background.mp3" type="audio/mpeg">
  </audio>
  <RouterView />
</template>
