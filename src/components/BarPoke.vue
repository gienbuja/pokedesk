<template>
  <div class="bottom-bar">
    <span>
      <BtnPoke label="All" @click="allSelected = true">
        <template #icon>
          <AllIcon />
        </template>
      </BtnPoke>
      <BtnPoke label="Favorites" @click="allSelected = false">
        <template #icon>
          <FavoriteIcon />
        </template>
      </BtnPoke>
    </span>
  </div>
</template>

<script setup lang="ts">
import BtnPoke from '@/components/BtnPoke.vue';
import AllIcon from './icons/AllIcon.vue';
import FavoriteIcon from './icons/FavoriteIcon.vue';

const allSelected = defineModel('allSelected', { default: true });

</script>
<style scoped>
.bottom-bar {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: #FFFFFF;
  box-shadow: 0px -5px 4px 0px #0000000D;
  padding-left: 30px;
  padding-right: 30px;
}

.bottom-bar span {
  max-width: 570px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
