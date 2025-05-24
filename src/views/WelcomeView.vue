<template>
  <div class="welcome">
    <WelcomeImage class="image" />
    <h1>
      Welcome to Pokédex
    </h1>
    <p>
      The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.
    </p>
    <RouterLink to="/index">
      <BtnPoke label="Get started" />
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import WelcomeImage from '@/components/icons/WelcomeImage.vue';
import BtnPoke from '@/components/BtnPoke.vue';

</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100dvh;
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
  margin-top: 40px;
}

p {
  font-family: Lato;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0%;
  text-align: center;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  min-width: 315px;
  max-width: 570px;
}
</style>
