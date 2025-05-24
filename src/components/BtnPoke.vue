<template>
  <button class="btn-poke" @click="$emit('click', $event)">
    <slot name="icon"></slot>
    <span>
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">

defineProps({
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
});

</script>

<style scoped>
.btn-poke {
  background-color: #F22539;
  height: 44px;
  border-radius: 60px;
  padding-top: 11px;
  padding-right: 20px;
  padding-bottom: 11px;
  padding-left: 20px;
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* margin-top: 50px; */
}

.btn-poke:active {
  background-color: #C00E20;
  transition: background-color 0.3s ease;
}

.btn-poke span {
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  vertical-align: middle;
  color: #FFFFFF;
}
</style>
