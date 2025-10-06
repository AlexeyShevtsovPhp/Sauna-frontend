<script>
import {SaunaInfo} from '../requestJS/SaunaInfo.js';
import {fetchBookingsByDate, sendBookings} from "../requestJS/Booking.js";

export default {
  data() {
    return {
      photos: [],
      sauna: null,
      currentIndex: 0,
      timeSlots: [],
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  methods: {

    prevPhoto() {
      this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    },
    nextPhoto() {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    },

    formatLocalDateTime(date) {
      const pad = (num) => num.toString().padStart(2, '0');

      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
          `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;},

    bookSauna() {
      const selectedSlots = this.timeSlots.filter(slot => slot.selected);
      if (selectedSlots.length === 0) {
        alert('Пожалуйста, выберите хотя бы один временной слот.');
        return;
      }

      const bookings = selectedSlots.map(slot => {
        const [startHour] = slot.time.split(':');
        const start = new Date(`${this.selectedDate}T${startHour.padStart(2, '0')}:00:00`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        return {
          sauna_id: this.sauna.id,
          start_time: this.formatLocalDateTime(start),
          end_time: this.formatLocalDateTime(end),
        };
      });

      sendBookings(bookings)
          .then(() => {
            alert('Бронирование успешно!');
            this.updateSlots();
          })
          .catch(() => {
            alert('Ошибка при бронировании');
          });
    },

    async updateSlots() {
      const slots = [];
      for (let hour = 9; hour < 20; hour++) {
        slots.push({
          id: `${this.selectedDate}-${hour}`,
          time: `${hour}:00 - ${hour + 1}:00`,
          available: true,
          selected: false,
        });
      }

      const bookings = await fetchBookingsByDate(this.selectedDate, this.sauna.id);

      bookings.forEach(booking => {
        const startHour = new Date(booking.start_time).getHours();
        const endHour = new Date(booking.end_time).getHours();

        for (let h = startHour; h < endHour; h++) {
          const slot = slots.find(s => s.id === `${this.selectedDate}-${h}`);
          if (slot) {
            slot.available = false;
            slot.selected = false;
          }
        }
      });
      this.timeSlots = slots;
    }
  },

  mounted() {
    const saunaId = this.$route.params.id;

    SaunaInfo(saunaId).then(response => {
      if (response.status === 200) {
        this.sauna = response.data.data;

        this.photos = Array.isArray(this.sauna.pictures) ? this.sauna.pictures : [];

        this.updateSlots();
      }
    });
  },

  computed: {
    currentPhoto() {
      return this.photos[this.currentIndex] || '';
    },
  },
};
</script>

<template>
  <div class="sauna-page">

    <div class="photo-gallery">
      <button @click="prevPhoto" class="nav-button left" aria-label="Назад">
        <img src="/images/back.png" alt="назад" class="arrow-icon"/>
      </button>

      <img :src="currentPhoto" alt="Сауна" class="main-photo"/>

      <button @click="nextPhoto" class="nav-button right" aria-label="Вперёд">
        <img src="/images/back.png" alt="вперёд" class="arrow-icon"/>
      </button>
    </div>

    <div class="photo-counter">
      {{ currentIndex + 1 }} / {{ photos.length }}
    </div>

    <div class="info-panel" v-if="sauna">
      <h2 class="sauna-title">{{ sauna.name }}</h2>
      <p class="sauna-description">{{ sauna.description }}</p>

      <h3>Выберите дату и время бронирования:</h3>
      <div class="date-picker">
        <label for="date">Дата:</label>
        <input
            type="date"
            id="date"
            v-model="selectedDate"
            @change="updateSlots"
        />
      </div>
      <div class="slots-wrapper">
        <div
            v-for="slot in timeSlots"
            :key="slot.id"
            class="slot-item"
        >
          <span class="slot-time">{{ slot.time }}</span>
          <label class="switch">
            <input
                type="checkbox"
                v-model="slot.selected"
                :disabled="!slot.available"
                :checked="!slot.available"
            />
            <span class="slider" :class="{ 'disabled': !slot.available }"></span>
          </label>
        </div>
      </div>

      <div class="book-button-container">
        <button class="book-button" @click="bookSauna">
          Забронировать
        </button>
      </div>
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

.date-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.date-picker label {
  font-weight: 500;
  font-size: 1rem;
  color: #333;
}

.date-picker input[type="date"] {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
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
</style>
