<template>
  <div class="layaout-search">
    <SearchIcon class="icon" />
    <input class="input" :value="modelValue" name="pokemon" id="pokemon"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" placeholder="Search">
  </div>
</template>

<script setup lang="ts">
import SearchIcon from './icons/SearchIcon.vue';

defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])

</script>

<style scoped>
.layaout-search {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 315px;
  height: 50px;
  border-radius: 5px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px #0000000A;
}

.layaout-search .input {
  width: 100%;
  height: 22;
  top: 14px;
  left: 43px;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0%;
  outline: none;
  border: none;
}

.layaout-search .input:focus {
  outline: none;
  box-shadow: none;
}

.layaout-search .icon {
  margin-left: 15px;
  margin-right: 15px;
  width: 18px;
  height: 18px;
}
</style>
