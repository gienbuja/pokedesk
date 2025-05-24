<script setup lang="ts">
import BtnPoke from './BtnPoke.vue';

const emit = defineEmits<{
  (e: 'clearFilters'): void,
}>();

function clearFilters() {
  emit('clearFilters')
}

</script>

<template>
  <div class="empty-view">
    <h1>
      Uh-oh!
    </h1>
    <p>
      You look lost on your journey!
    </p>
    <div>
      <span>
        <BtnPoke label="Go back home" @click="clearFilters"></BtnPoke>
      </span>
    </div>
  </div>
</template>

<style scoped>
.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  height: 100%;
  width: 100%;
  gap: 10px;
}

.empty-view h1 {
  font-family: Lato;
  font-weight: 700;
  font-size: 36px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}

.empty-view p {
  font-family: Lato;
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: center;
}

.empty-view div {
  display: flex;
  justify-content: center;
}
</style>
