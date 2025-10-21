<script setup>
import { ref, computed, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { saunaInfo } from '../requestJS/SaunaInfo.js';
import { fetchBookingsByDate, sendBookings } from "../requestJS/Booking.js";
import { ElNotification } from 'element-plus';

const photos = ref([]);
const sauna = ref(null);
const currentIndex = ref(0);
const timeSlots = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const router = useRouter();
const route = useRoute();

function prevPhoto() {
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
}

function nextPhoto() {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
}

function goToMap() {
  router.push({ name: 'saunaOnMap', params: { id: sauna.value.id } });
}

function formatLocalDateTime(date) {
  const pad = (num) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function updateSlots() {
  if (!sauna.value) return;

  const slots = [];
  for (let hour = 9; hour < 20; hour++) {
    slots.push({
      id: `${selectedDate.value}-${hour}`,
      time: `${hour}:00 - ${hour + 1}:00`,
      available: true,
      selected: false,
    });
  }

  const bookings = await fetchBookingsByDate(selectedDate.value, sauna.value.id);

  bookings.forEach(booking => {
    const startHour = new Date(booking.start_time).getHours();
    const endHour = new Date(booking.end_time).getHours();

    for (let h = startHour; h < endHour; h++) {
      const slot = slots.find(s => s.id === `${selectedDate.value}-${h}`);
      if (slot) {
        slot.available = false;
        slot.selected = false;
      }
    }
  });

  timeSlots.value = slots;
}

function disabledDate(time) {
  return time.getTime() < Date.now() - 86400000;
}

function bookSauna() {
  const selectedSlots = timeSlots.value.filter(slot => slot.selected);

  if (selectedSlots.length === 0) {
    ElNotification({
      title: 'Ошибка',
      message: 'Пожалуйста, выберите хотя бы один временной слот.',
      type: 'warning',
      offset: 50,
    });
    return;
  }

  const bookings = selectedSlots.map(slot => {
    const [startHour] = slot.time.split(':');
    const start = new Date(`${selectedDate.value}T${startHour.padStart(2, '0')}:00:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return {
      sauna_id: sauna.value.id,
      start_time: formatLocalDateTime(start),
      end_time: formatLocalDateTime(end),
    };
  });

  sendBookings(bookings)
      .then(() => {
        ElNotification({
          title: 'Успех',
          message: 'Бронирование успешно!',
          type: 'success',
          offset: 50,
        });
        updateSlots();
      })
      .catch(() => {
        ElNotification({
          title: 'Ошибка',
          message: 'Ошибка при бронировании',
          type: 'error',
          offset: 50,
        });
      });
}

onMounted(() => {
  const saunaId = route.params.id;
  saunaInfo(saunaId).then(response => {
    if (response.status === 200) {
      sauna.value = response.data[0];
      photos.value = Array.isArray(sauna.value.pictures) ? sauna.value.pictures : [];
      updateSlots();
    }
  });
});

const currentPhoto = computed(() => photos.value[currentIndex.value] || '');

</script>

<template>
  <div class="sauna-page">

    <div class="photo-gallery">
      <button @click="prevPhoto" class="nav-button left" aria-label="Назад">
        <img src="/images/back.png" alt="назад" class="arrow-icon" />
      </button>

      <img :src="currentPhoto" alt="Сауна" class="main-photo" />

      <button @click="nextPhoto" class="nav-button right" aria-label="Вперёд">
        <img src="/images/back.png" alt="вперёд" class="arrow-icon" />
      </button>
    </div>

    <div class="photo-counter">
      {{ currentIndex + 1 }} / {{ photos.length }}
    </div>

    <div class="info-panel" v-if="sauna">

      <div class="sauna-header">
        <h2 class="sauna-title">{{ sauna.name }}</h2>
        <a href="#" @click.prevent="goToMap" class="map-link">На карте</a>
      </div>

      <p class="sauna-description">{{ sauna.description }}</p>

      <h3>Выберите дату и время бронирования:</h3>

      <form @submit.prevent="bookSauna" class="booking-form">
        <div class="date-picker">
          <label for="date">Дата:</label>
          <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="Выберите дату"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              @change="updateSlots"
          />
        </div>

        <div class="slots-wrapper">
          <div v-for="slot in timeSlots" :key="slot.id" class="slot-item">
            <span class="slot-time">{{ slot.time }}</span>
            <label class="switch">
              <input
                  type="checkbox"
                  v-model="slot.selected"
                  :disabled="!slot.available"
                  :checked="!slot.available"
              />
              <span class="slider" :class="{ disabled: !slot.available }"></span>
            </label>
          </div>
        </div>

        <div class="book-button-container">
          <button class="book-button" type="submit">
            Забронировать
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<style scoped>
body {
  background: linear-gradient(to bottom, #f5f3ef 0%, #f5f3ef 100%);
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.arrow-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
  display: block;
  margin: auto;
  user-select: none;
  pointer-events: none;
}

.sauna-header {
  display: flex;
  justify-content: center;
  margin-left: 72px;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.map-link {
  font-size: 0.9rem;
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
  white-space: nowrap;
  margin-left: -10px;
}

.map-link:hover {
  text-decoration: none;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.date-picker label {
  font-weight: 500;
  font-size: 1rem;
  color: #333;
}

input:disabled + .slider {
  background-color: #817d7d !important;
  cursor: not-allowed;
}

input:disabled + .slider:before {
  background: #eee;
  transform: translateX(22px);
}

.book-button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.book-button {
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, #48c60f, #429a53);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(86, 171, 47, 0.5);
  transition: background 0.4s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.book-button:hover {
  background: linear-gradient(135deg, #54b823, #84d63c);
  box-shadow: 0 8px 20px rgba(78, 159, 39, 0.7);
  transform: translateY(-2px);
}

.book-button:active {
  transform: translateY(1px);
  box-shadow: 0 4px 12px rgba(78, 159, 39, 0.5);
}

.book-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(86, 171, 47, 0.6);
}

.nav-button.right .arrow-icon {
  transform: scaleX(-1);
}

.sauna-page {
  display: flex;
  max-width: 1200px;
  margin: 4rem auto;
  gap: 2rem;
  padding: 2rem;
  border: 2px solid #f0eae2;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  background: #fffefc;
  background-clip: padding-box;
}

.photo-gallery {
  position: relative;
  width: 35%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-photo {
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.photo-counter {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  margin-top: 402px;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.nav-button {
  position: absolute;
  top: 53%;
  transform: translateY(-50%);
  opacity: 0.7;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, transform 0.2s ease;
  padding: 0;
}

.nav-button:hover {
  opacity: 1;
  background: #ffffff;
  border: none;
  transform: translateY(-50%) scale(1.02);
}

.nav-button.left {
  left: -1.2rem;
}

.nav-button.right {
  right: -1.2rem;
}

.nav-button:focus {
  outline: none;
  box-shadow: none;
}

.info-panel {
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sauna-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.sauna-description {
  color: #555;
  font-size: 1.1rem;
  text-align: justify;
}

.slots-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.slot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fefefe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.slot-time {
  font-size: 0.95rem;
  color: #333;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.disabled {
  background-color: #817d7d !important;
  cursor: not-allowed;
}

.slider.disabled:before {
  background: #eee;
  transform: translateX(22px);
}
</style>
