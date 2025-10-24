<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElNotification } from 'element-plus';
import { sendBookings } from "../requestJS/Booking.js";
import { useRouter } from 'vue-router';

const bookings = ref([]);
const router = useRouter();

let clearTimeoutId = null;
let intervalId = null;
let notified = false;

const TIME_LIMIT = 60;
const timeLeft = ref(0);

function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(datetimeStr) {
  const date = new Date(datetimeStr);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function clearBookingData() {
  if (notified) return;

  localStorage.removeItem('selectedBookings');
  localStorage.removeItem('bookingEndTime');
  bookings.value = [];
  ElNotification({
    title: 'Время истекло',
    message: 'Время на оплату вышло.',
    type: 'warning',
    offset: 50,
  });
  clearInterval(intervalId);
  timeLeft.value = 0;
}

function payForBooking(event) {
  event.preventDefault();

  const savedBookings = localStorage.getItem('selectedBookings');
  const bookingsData = JSON.parse(savedBookings);

  sendBookings(bookingsData)
      .then(() => {
        ElNotification({
          title: 'Успех',
          message: 'Бронирование успешно! Оплата прошла.',
          type: 'success',
          offset: 50,
        });
        if (clearTimeoutId) clearTimeout(clearTimeoutId);
        if (intervalId) clearInterval(intervalId);
        localStorage.removeItem('selectedBookings');
        localStorage.removeItem('bookingEndTime');
        router.push('/profile');
      })
      .catch(() => {
        ElNotification({
          title: 'Ошибка',
          message: 'Ошибка при бронировании и оплате.',
          type: 'error',
          offset: 50,
        });
      });
}

onMounted(() => {
  const savedBookings = localStorage.getItem('selectedBookings');
  if (savedBookings) {
    bookings.value = JSON.parse(savedBookings);

    const savedEndTime = localStorage.getItem('bookingEndTime');
    if (savedEndTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const endTime = parseInt(savedEndTime, 10);
      timeLeft.value = Math.max(endTime - currentTime, 0);

      if (timeLeft.value === 0) {
        clearBookingData();
        return;
      }
      clearTimeoutId = setTimeout(() => {
        clearBookingData();
      }, timeLeft.value * 1000);

      intervalId = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
          localStorage.setItem('timeLeft', timeLeft.value);
        }
      }, 1000);
    } else {
      const endTime = Math.floor(Date.now() / 1000) + TIME_LIMIT;
      localStorage.setItem('bookingEndTime', endTime);
    }
  }
});

onBeforeUnmount(() => {
  if (clearTimeoutId) clearTimeout(clearTimeoutId);
  if (intervalId) clearInterval(intervalId);
  localStorage.setItem('timeLeft', timeLeft.value);
});

function addNewBooking(newBooking) {
  bookings.value.push(newBooking);

  localStorage.setItem('selectedBookings', JSON.stringify(bookings.value));

  const savedEndTime = localStorage.getItem('bookingEndTime');
  if (savedEndTime) {
    const currentTime = Math.floor(Date.now() / 1000);
    const newEndTime = currentTime + TIME_LIMIT;
    localStorage.setItem('bookingEndTime', newEndTime);
  }
}
</script>

<template>
  <div class="pay-page">
    <div class="header-with-timer">
      <h2 class="page-title">Ваши бронирования</h2>
    </div>

    <form v-if="bookings.length > 0" @submit="payForBooking">
      <div class="booking-list-wrapper">
        <div
            v-for="(booking, index) in bookings"
            :key="index"
            class="booking-card"
        >
          <div class="booking-line">
            <span class="sauna-name">{{ booking.sauna_name }}</span>
            <span class="booking-date">{{ formatDate(booking.start_time) }}</span>
            <span class="booking-time">
              {{ formatTime(booking.start_time) }} – {{ formatTime(booking.end_time) }}
            </span>
          </div>
        </div>
      </div>

      <div class="pay-button-wrapper">
        <button type="submit" class="pay-button">💳 Оплатить</button>
      </div>
    </form>

    <div v-else class="no-bookings">
      <p>Нет данных о бронировании.</p>
    </div>
  </div>
</template>

<style scoped>
.pay-page {
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fffdf9;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 28vh;
}

.header-with-timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-left: 238px;
  margin-top: 0;
  margin-bottom: 0;
}

.timer {
  font-size: 1rem;
  color: #a15d00;
  font-weight: 600;
  background: #fff4d6;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  user-select: none;
  min-width: 110px;
  text-align: center;
}

.booking-list-wrapper {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 2rem;
  padding-right: 10px;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card {
  padding: 1.25rem 1.75rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 100%;
}

.booking-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 1rem;
}

.sauna-name {
  font-weight: 600;
  color: #494848;
  min-width: 130px;
  font-size: 1.15em;
  white-space: nowrap;
}

.booking-date {
  color: #666;
  min-width: 120px;
  white-space: nowrap;
}

.booking-time {
  font-weight: 500;
  color: #444;
  min-width: 120px;
  white-space: nowrap;
}

.pay-button-wrapper {
  display: flex;
  justify-content: center;
}

.pay-button {
  background: linear-gradient(135deg, #43b047, #67c53c);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(68, 177, 67, 0.3);
  transition: background 0.2s ease, transform 0.2s ease;
  margin-left: -20px;
}

.pay-button:hover {
  background: linear-gradient(135deg, #489e4d, #5cc124);
  transform: translateY(-1px);
}

.pay-button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(68, 177, 67, 0.2);
}

.no-bookings {
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  margin-left: -2px;
}
</style>
