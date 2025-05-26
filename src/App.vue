<script setup lang="ts">
import { onMounted, ref } from 'vue'

const backgroundAudio = ref<HTMLAudioElement | null>(null)

document.addEventListener('click', () => {
  if (backgroundAudio.value) {
    backgroundAudio.value.currentTime = 0.1;
    backgroundAudio.value.play();
  }
}, { once: true });
onMounted(() => {
  fetch(`https://pokedex-api-sounds.onrender.com/`);
})
</script>

<template>
  <audio ref="backgroundAudio" loop>
    <source src="/assets/sounds/background.mp3" type="audio/mpeg">
  </audio>
  <RouterView />
</template>
