<script setup lang="ts">
import type { Pokemon } from '@/types';

defineProps<{
  pokemon: Pokemon
}>();
</script>

<template>
  <ul>
    <li>
      <span>Name:</span>
      <span>{{ pokemon.name }}</span>
    </li>
    <li>
      <span>Weight:</span>
      <span>{{ pokemon.weight }}</span>
    </li>
    <li>
      <span>Height:</span>
      <span>{{ pokemon.height }}</span>
    </li>
    <li>
      <span>Types:</span>
      <span>{{pokemon.types?.map(type => type.type.name).join(', ')}}</span>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 20px;
  margin: 0;
  height: 231px;
}

li {
  border-bottom: 1px solid #E8E8E8;
  padding: 10px 0;
}

span {
  font-family: Lato;
  font-weight: 700;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0%;
  height: 27px;
}

span:last-child {
  font-weight: 500;
  text-transform: capitalize;
}
</style>
