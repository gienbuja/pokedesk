<template>
  <div class="welcome">
    <WelcomeImage class="image" />
    <h1>
      Welcome to Pokédex
    </h1>
    <p>
      The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.
    </p>
    <span>
      <BtnPoke label="Get started" @click="goToIndex" />
    </span>
  </div>
</template>
<script setup lang="ts">
import WelcomeImage from '@/components/icons/WelcomeImage.vue';
import BtnPoke from '@/components/BtnPoke.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function goToIndex() {
  router.push('/index');
}

</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100dvh;
  gap: 30px;
}

.image {
  width: 325;
  height: 288;
}

h1 {
  font-family: Lato;
  font-weight: 700;
  font-size: 26px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}

p {
  font-family: Lato;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
  min-width: 315px;
  max-width: 570px;
}
</style>
