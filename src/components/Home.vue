<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {getSaunas} from '../requestJS/SaunaListFetch.js';

const router = useRouter();
const saunaList = ref([]);

function goToSauna(sauna) {
  router.push({name: 'sauna', params: {id: sauna.id}});
}

function parseFirstPicture(picture) {
  if (!picture) return '';
  const arr = JSON.parse(picture);
  return arr[0] || '';
}

onMounted(async () => {
  const response = await getSaunas();
  if (response.success) {
    saunaList.value = response.data;
  }
});
</script>

<template>
  <div class="page-wrapper">
    <div class="background-layer"></div>

    <div class="golden-wrapper">
      <div class="sauna-grid">
        <div
            v-for="sauna in saunaList"
            :key="sauna.id"
            class="sauna-card"
            @click="goToSauna(sauna)"
        >
          <div class="sauna-image-placeholder">
            <el-image
                :src="sauna.picture || '/images/default-placeholder.png'"
                alt="Изображение сауны"
                fit="cover"
                style="width: 100%; height: 140px;"
            />
          </div>
          <div class="sauna-name">{{ sauna.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;

  z-index: 0;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/mainTheme.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
  filter: brightness(0.7) contrast(1.1) saturate(1.2);
  pointer-events: none;
}

.golden-wrapper {
  padding: 2rem;
  border: 10px solid #e6d7a7;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #fdf6d8 0%, #f9e79f 100%);

  margin-left: -40px;
  width: 108%;
  box-sizing: border-box;
}

.sauna-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  position: relative;
  z-index: 1;
}

.sauna-card {
  height: 195px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sauna-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.sauna-image-placeholder {
  width: 100%;
  height: 140px;
  background-color: #eee;
  border-bottom: 1px solid #ddd;
}

.sauna-name {
  padding: 1rem 1rem;
  font-size: 1.08rem;
  color: #3e2f1c;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .sauna-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .sauna-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sauna-grid {
    grid-template-columns: 1fr;
  }
}

.sauna-image-placeholder img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
</style>
