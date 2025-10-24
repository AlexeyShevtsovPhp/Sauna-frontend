<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {getSortedSaunas} from '../requestJS/Sort.js';

const router = useRouter();
const saunaList = ref([]);
const loading = ref(false);
const sortBy = ref('standard');

const sortOptions = [
  {label: 'Название', value: 'name'},
  {label: 'Цена', value: 'lowPrice'},
  {label: 'Рейтинг', value: 'rating'},
  {label: 'Стандарт', value: 'standard'}
];

const sortSaunas = async (option) => {
  sortBy.value = option;
  loading.value = true;
  try {
    const response = await getSortedSaunas(option);
    console.log('Data after sorting:', response.data);
    saunaList.value = response.data;
  } catch (error) {
    console.error('Ошибка при запросе данных: ', error);
  } finally {
    loading.value = false;
  }
};

const goToSauna = (sauna) => {
  router.push({name: 'sauna', params: {id: sauna.id}});
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getSortedSaunas(sortBy.value);
    console.log('Initial response data:', response.data);
    saunaList.value = response.data;
  } catch (error) {
    console.error('Ошибка при запросе данных: ', error);
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <div class="page-wrapper">
    <div class="background-layer"></div>

    <div class="golden-wrapper">
      <div class="sort-container">
        <span class="sort-label">Сортировать:</span>
        <div class="sort-links">
          <a
              v-for="option in sortOptions"
              :key="option.value"
              href="#"
              :class="{ active: sortBy.value === option.value }"
              @click.prevent="sortSaunas(option.value)"
              class="sort-link"
          >
            {{ option.label }}
          </a>
        </div>
      </div>

      <div v-if="loading" class="loading-indicator">Загрузка...</div>

      <div v-if="!loading && saunaList.length > 0" class="sauna-grid">
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
      <div v-else-if="!loading && saunaList.length === 0" class="no-data">Нет данных для отображения.</div>
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

.sort-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 10px;
  width: 250px;
  margin-top: -13px;
}

.sort-label {
  font-size: 1.1rem;
  color: #3e2f1c;
  margin-right: 15px;
  font-weight: bold;
}

.sort-links {
  display: flex;
  gap: 20px;
}

.sort-link {
  font-size: 1rem;
  color: #3e2f1c;
  text-decoration: none;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.2s ease;
  display: inline-block;
  margin-top: 5px;
}

.sort-link:hover {
  background-color: #e6d7a7;
  color: #3e2f1c;
  transform: scale(1.05);
}

.sort-link.active {
  background-color: #e6d7a7;
  color: #3e2f1c;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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

.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  color: #3e2f1c;
  margin-top: 2rem;
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
