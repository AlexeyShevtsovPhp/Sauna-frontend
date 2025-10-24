<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { saunaInfo } from '../requestJS/SaunaInfo.js';
import { fetchBookingsByDate } from "../requestJS/Booking.js";
import { ElNotification } from 'element-plus';
import { sendSaunaRating } from '../requestJS/Rating.js';
import { createComment, fetchComments } from '../requestJS/Comments.js';
import { nextTick } from 'vue';

const userRating = ref(0);
const hoverRating = ref(0);
const photos = ref([]);
const sauna = ref(null);
const currentIndex = ref(0);
const timeSlots = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const router = useRouter();
const route = useRoute();
const userAvatar = localStorage.getItem('avatar');
const userName = localStorage.getItem('name');

const averageRating = ref(0);
const saunaId = Number(route.params.id);

const userReview = ref('');
const reviews = ref([]);

const currentPage = ref(1);
const totalPages = ref(1);
const pages = ref([]);

async function submitReview() {
  if (userReview.value.trim() === '') return;
  await createComment(saunaId, userReview.value);

  ElNotification({
    title: 'Спасибо!',
    message: 'Ваш отзыв был отправлен!',
    type: 'success',
    offset: 50,
  });

  userReview.value = '';
  await loadComments();

  if (reviews.value.length >= 5) {
    currentPage.value = totalPages.value;
    await loadComments();
  }
}

async function loadComments() {
  const response = await fetchComments(saunaId, currentPage.value);
  reviews.value = response.data.data;
  totalPages.value = response.data.meta.last_page;
  pages.value = Array.from({ length: totalPages.value }, (_, index) => index + 1);
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadComments();
}

nextTick(() => {
  const currentPageBtn = document.querySelector('.page-btn.active');
  if (currentPageBtn) {
    currentPageBtn.focus();
  }
});

const visiblePages = computed(() => {
  const maxVisible = 5;
  const range = [];

  let startPage = Math.max(1, currentPage.value - 2);
  let endPage = Math.min(totalPages.value, currentPage.value + 2);

  if (currentPage.value <= 3) {
    endPage = Math.min(maxVisible, totalPages.value);
  } else if (currentPage.value >= totalPages.value - 2) {
    startPage = Math.max(totalPages.value - maxVisible + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  return range;
});


function prevPhoto() {
  currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
}

function nextPhoto() {
  currentIndex.value = (currentIndex.value + 1) % photos.value.length;
}

function goToMap() {
  router.push({ name: 'saunaOnMap', params: { id: sauna.value.id } });
}

function goToPay() {
  router.push({ name: 'Pay' });
}

async function rate(value) {
  userRating.value = value;

  await sendSaunaRating(saunaId, value);

  ElNotification({
    title: 'Спасибо!',
    message: `Вы поставили ${value}★`,
    type: 'success',
    offset: 50,
  });
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
        if (booking.paid === 1 || booking.blocked === 1) {
          slot.available = false;
          slot.selected = false;
        }
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
      sauna_name: sauna.value.name,
      start_time: formatLocalDateTime(start),
      end_time: formatLocalDateTime(end),
      blocked: 1,
      paid: 0,
    };
  });

  localStorage.setItem('selectedBookings', JSON.stringify(bookings));

  goToPay();
}

onMounted(() => {
  // Прокручиваем страницу в начало
  window.scrollTo(0, 0);

  const saunaId = route.params.id;
  saunaInfo(saunaId).then(response => {
    if (response.status === 200) {
      const data = response.data[0];

      sauna.value = data.sauna;
      photos.value = Array.isArray(sauna.value.pictures) ? sauna.value.pictures : [];
      averageRating.value = data.rating.averageRating;
      userRating.value = data.rating.userRating;
      updateSlots();
    }
  });
  loadComments();
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

      <div class="sauna-details">
        <div class="detail-item">
          <img src="/images/coin.png" alt="Цена" class="detail-icon" />
          <span>Стоимость: <strong>{{ sauna.lowPrice }} – {{ sauna.highPrice }} руб/час</strong></span>
        </div>
        <div class="detail-item">
          <img src="/images/people.png" alt="Вместимость" class="detail-icon" />
          <span>Вместимость: <strong>до {{ sauna.size }} человек</strong></span>
        </div>
      </div>

      <div class="rating-block">
        <div class="rating-stars">
          <img
              v-for="n in 5"
              :key="n"
              :src="n <= (hoverRating || userRating) ? '/images/star.png' : '/images/starVoid.png'"
              class="star-icon"
              @mouseover="hoverRating = n"
              @mouseleave="hoverRating = 0"
              @click="rate(n)"
              alt="звезда"
          />
        </div>

        <div v-if="averageRating !== 0" class="average-rating">
          <span>Средний рейтинг: {{ averageRating }}★</span>
        </div>
      </div>

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

  <div class="reviews-section">
    <h3>Оставьте ваш отзыв</h3>

    <form class="review-form">
      <textarea
          v-model="userReview"
          placeholder="Напишите ваш отзыв о бане..."
          rows="4"
          class="review-textarea"
      ></textarea>

      <button type="submit" @click.prevent="submitReview" class="submit-review-btn">Отправить отзыв</button>
    </form>

    <div v-if="reviews.length > 0" class="reviews-list">
      <div v-for="(review, index) in reviews" :key="index" class="review-item">
        <div class="review-header">
          <img :src="review.user?.avatar || userAvatar" alt="User" class="review-user-icon" />
          <span class="review-author">{{ review.user.name || userName }}</span>
        </div>
        <p class="review-text">{{ review.comment }}</p>
      </div>
    </div>

    <div v-else>
      <p>Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
          @click="changePage(1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
          ref="firstPageBtn"
      >
        &laquo; Первая
      </button>

      <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
          ref="prevPageBtn"
      >
        &laquo; Назад
      </button>

      <span v-for="page in visiblePages" :key="page" class="pagination-page">
        <button
            @click="changePage(page)"
            :class="{ active: page === currentPage }"
            class="page-btn"
            :ref="page === currentPage ? 'currentPageBtn' : ''"
        >
          {{ page }}
        </button>
      </span>

      <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          ref="nextPageBtn"
      >
        Вперёд &raquo;
      </button>

      <button
          @click="changePage(totalPages)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          ref="lastPageBtn"
      >
        Последняя &raquo;
      </button>
    </div>
  </div>
</template>

<style scoped>
body {
  background: linear-gradient(to bottom, #f5f3ef 0%, #f5f3ef 100%);
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.rating-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 5px;
  margin-top: -25px;
}

.rating-stars {
  display: flex;
  gap: 0.5rem;
}

.star-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
}

.star-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.05);
}

.average-rating {
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 5px 10px;
  margin: 0 5px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-page {
  margin: 0 5px;
}

.page-btn {
  padding: 5px 10px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  cursor: pointer;
  width: 38px;
}

.page-btn.active {
  background-color: #007bff;
  color: white;
  width: 38px;
}

.page-btn:hover {
  background-color: #ddd;
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

.sauna-details {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1rem 0 1.5rem 0;
  padding: 1rem 1.5rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: -9px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #333;
  gap: 0.5rem;
}

.detail-item strong {
  color: #1e7a32;
  font-weight: 600;
}

.detail-icon {
  width: 28px;
  height: 28px;
  opacity: 0.85;
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

.reviews-section {
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.reviews-section h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  padding-bottom: 35px;
}

.review-form {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-direction: column;
}

.review-textarea {
  max-width: 1300px;
  height: 180px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  resize: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  width: 100%;
}

.user-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(181, 243, 154, 0.6);
}

.submit-review-btn {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #48c60f, #429a53);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(86, 171, 47, 0.5);
  transition: background 0.4s ease, transform 0.2s ease;
  align-self: flex-start;
}

.submit-review-btn:hover {
  background: linear-gradient(135deg, #54b823, #84d63c);
  box-shadow: 0 8px 20px rgba(78, 159, 39, 0.7);
  transform: translateY(-2px);
}

.submit-review-btn:active {
  transform: translateY(1px);
}

.reviews-list {
  margin-top: 1rem;
}

.review-item {
  padding: 1rem;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-user-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.review-author {
  font-weight: bold;
  color: #333;
}

.review-text {
  margin-top: 1rem;
  font-size: 1rem;
  color: #555;
  text-align: justify;
}

.reviews-list p {
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.7;
  padding: 16px;
  margin-bottom: 18px;
  background-color: #f4f8fb;
  border-left: 5px solid #84aa74;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

</style>
