<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getSaunas } from '../requestJS/SaunaListFetch.js';

const router = useRouter();
const saunaList = ref([]);

function goToSauna(sauna) {
  router.push({ name: 'sauna', params: { id: sauna.id } });
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
  <div class="sauna-grid">
    <div
        v-for="sauna in saunaList"
        :key="sauna.id"
        class="sauna-card"
        @click="goToSauna(sauna)"
    >
      <div class="sauna-image-placeholder">
        <el-image
            :src="parseFirstPicture(sauna.picture)"
            alt="Изображение сауны"
            fit="cover"
            style="width: 100%; height: 120px;"
        />
      </div>
      <div class="sauna-name">{{ sauna.name }}</div>
    </div>
  </div>
</template>

<style scoped>

h1 {
  font-size: 1.5rem;
  color: #222;
  margin: 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: transform 0.3s ease;
}

h1:hover {
  transform: scale(1.01);
}

.social-links a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #007bff;
}

.sauna-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem 0;
}

.sauna-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sauna-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.sauna-image-placeholder {
  width: 100%;
  height: 120px;
  background-color: #eee;
  border-bottom: 1px solid #ddd;
}

.sauna-name {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
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
  height: 120px;
  object-fit: cover;
  display: block;
}

.social-links a {
  font-size: 1.5rem;
  color: #d0f0f0;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  text-decoration: none;
}

.social-links a:hover {
  color: #ffdd57;
  background: #fff8cc;
  transform: scale(1.2);
  box-shadow: 0 0 8px #ffdd57;
}

</style>