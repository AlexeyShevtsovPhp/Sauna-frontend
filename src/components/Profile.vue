<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getUserProfileInfo } from '../requestJS/UserInfo.js';
import { updateUser } from '../requestJS/UpdateUser.js';
import { uploadAvatar } from "../requestJS/UploadAvatar.js";
import { getProfileBooking, deleteBooking } from "../requestJS/Booking.js";
import { ElNotification } from 'element-plus';

const profile = reactive({
  name: '',
  lastName: '',
  middleName: '',
  avatar: '',
  email: '',
  phone: '',
  address: '',
});

const bookings = ref([]);
const selectedBookingId = ref(null);
const initialProfileData = ref({});
const loadingBookings = ref(true);
const tempAvatar = ref(null);
const avatarInput = ref(null);

function showNotification(message, type = 'success') {
  ElNotification({
    message,
    type,
    offset: 50,
    duration: 3000,
  });
}

function selectBooking(id) {
  selectedBookingId.value = selectedBookingId.value === id ? null : id;
}

async function saveProfile() {
  if (profile.name.trim().length < 2) {
    showNotification('Имя должно содержать минимум 2 символа', 'error');
    return;
  }

  if (!profile.email.trim()) {
    showNotification('Email обязателен', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email.trim())) {
    showNotification('Введите корректный email', 'error');
    return;
  }

  const userData = {
    name: profile.name || '',
    lastName: profile.lastName || '',
    middleName: profile.middleName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
  };

  if (tempAvatar.value) {
    await uploadAvatar(tempAvatar.value);
    await updateUser(userData);
    window.location.reload();
  } else {
    await updateUser(userData);
    showNotification('Изменения сохранены', 'success');
    initialProfileData.value = { ...profile };
  }
}

async function removeBooking(id) {
  await deleteBooking(id);
  if (selectedBookingId.value === id) {
    selectedBookingId.value = null;
  }
  await fetchBookings();
  showNotification('Бронирование удалено', 'success');
}

function formatDate(datetimeStr) {
  const date = new Date(datetimeStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function triggerFileInput() {
  avatarInput.value.click();
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    tempAvatar.value = file;
    profile.avatar = URL.createObjectURL(file);
  }
}

async function fetchBookings() {
  loadingBookings.value = true;
  try {
    const response = await getProfileBooking();
    bookings.value = response || [];
  } catch (error) {
    console.error('Ошибка при загрузке бронирований:', error);
  } finally {
    loadingBookings.value = false;
  }
}

const sortedBookings = computed(() => {
  return [...bookings.value].sort((a, b) => {
    const nameA = a.sauna?.name?.toLowerCase() || '';
    const nameB = b.sauna?.name?.toLowerCase() || '';

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    const timeA = a.time?.start_time ? new Date(a.time.start_time).getTime() : 0;
    const timeB = b.time?.start_time ? new Date(b.time.start_time).getTime() : 0;

    return timeA - timeB;
  });
});

const isProfileChanged = computed(() => {
  if (tempAvatar.value) return true;

  const keys = ['name', 'lastName', 'middleName', 'email', 'phone', 'address'];
  return keys.some(key => profile[key] !== initialProfileData.value[key]);
});

onMounted(async () => {
  try {
    const response = await getUserProfileInfo();
    if (response.success) {
      initialProfileData.value = { ...response.user };
      Object.assign(profile, initialProfileData.value);
    }
    await fetchBookings();
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
  }
});
</script>

<template>
  <div class="user-profile-page">
    <div class="user-profile-card">
      <div
          class="avatar-section"
          @click="triggerFileInput"
          @keydown.enter.space.prevent="triggerFileInput"
          tabindex="0"
          role="button"
          aria-label="Загрузить аватар"
      >
        <img :src="profile.avatar" alt="Аватар пользователя" class="avatar" />
        <div class="avatar-overlay">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="edit-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M16.768 3.768a2.5 2.5 0 013.536 3.536L7.5 20.036H3v-4.5L16.768 3.768z"
            />
          </svg>
        </div>
        <input
            ref="avatarInput"
            type="file"
            @change="handleAvatarUpload"
            accept="image/*"
            class="avatar-upload"
            aria-hidden="true"
            tabindex="-1"
        />
      </div>

      <div class="user-form">
        <div class="form-group">
          <label for="firstName">Имя</label>
          <input v-model="profile.name" id="firstName" type="text" placeholder="Введите имя" />
        </div>
        <div class="form-group">
          <label for="lastName">Фамилия</label>
          <input v-model="profile.lastName" id="lastName" type="text" placeholder="Введите фамилию" />
        </div>
        <div class="form-group">
          <label for="middleName">Отчество</label>
          <input v-model="profile.middleName" id="middleName" type="text" placeholder="Введите отчество" />
        </div>
      </div>
    </div>

    <div class="user-contact-section">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="profile.email" id="email" type="email" placeholder="example@mail.com" />
      </div>
      <div class="form-group">
        <label for="phone">Телефон</label>
        <input v-model="profile.phone" id="phone" type="tel" placeholder="+7 (999) 123-45-67" />
      </div>
      <div class="form-group">
        <label for="address">Адрес</label>
        <input v-model="profile.address" id="address" type="text" placeholder="Город, улица, дом" />
      </div>
    </div>

    <div class="actions">
      <button
          class="save-button"
          @click="saveProfile"
          :disabled="!isProfileChanged"
          :class="{ 'button-disabled': !isProfileChanged }"
      >
        Сохранить изменения
      </button>
    </div>

    <h3 class="bookings-title">Забронированные бани</h3>
    <div class="bookings-list-wrapper">
      <div class="bookings-list">
        <template v-if="bookings.length > 0">
          <div
              v-for="(booking, index) in sortedBookings"
              :key="booking.sauna?.id || index"
              class="booking-card"
              :class="{ selected: booking.sauna?.id === selectedBookingId }"
              tabindex="0"
              role="button"
              @click="booking.sauna && selectBooking(booking.sauna.id)"
          >
            <div class="booking-name">{{ booking.sauna?.name || 'Пусто' }}</div>
            <div class="booking-time" v-if="booking.time">
              {{ formatTime(booking.time.start_time) }} - {{ formatTime(booking.time.end_time) }}
            </div>
            <div class="booking-date" v-if="booking.time">
              {{ formatDate(booking.time.start_time) }}
            </div>

            <button
                v-if="booking.sauna?.id === selectedBookingId"
                class="delete-booking-button"
                @click.stop="removeBooking(booking.sauna.id)"
            >
              Удалить
            </button>
          </div>
        </template>
        <div v-else class="no-bookings">Пусто</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-bookings {
  padding: 1rem;
  color: #777;
  font-style: italic;
  text-align: center;
}

.bookings-list-wrapper {
  max-height: 310px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e3e7;
}

.booking-card {
  padding: 0.8rem 1.5rem;
  border-radius: 14px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-card:hover,
.booking-card:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
  outline: none;
}

.booking-card.selected {
  border-color: #2563eb;
  background-color: #e0e7ff;
}

.save-button:disabled,
.button-disabled {
  background-color: #e2e8f0;
  color: #9ca3af;
  cursor: not-allowed;
  pointer-events: none;
}

.delete-booking-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.35rem 0.8rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  background-color: #e53e3e;
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(229, 62, 62, 0.4);
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.delete-booking-button:hover {
  background-color: #c53030;
}

.delete-booking-button:focus-visible {
  outline: 2px solid #f56565;
  outline-offset: 2px;
}

.delete-booking-button svg {
  width: 14px;
  height: 14px;
  stroke: white;
  stroke-width: 2;
  fill: none;
}

.save-button:disabled:hover,
.button-disabled:hover {
  background-color: #e2e8f0;
  cursor: not-allowed;
}

.user-profile-page {
  max-width: 780px;
  margin: 2rem auto 4rem;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
}

.user-profile-card {
  display: flex;
  gap: 2rem;
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.avatar-section {
  flex-shrink: 0;
  position: relative;
  width: 140px;
  height: 140px;
  cursor: pointer;
  outline: none;
}

.avatar {
  width: 100%;
  height: 100%;
  margin-left: 23px;
  margin-top: 10px;
  border-radius: 50%;
  border: 3px solid #cbd5e1;
  object-fit: cover;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  display: block;
}

input::placeholder {
  color: rgba(100, 100, 100, 0.4);
  font-style: italic;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(26px, 12px);
  background-color: rgba(25, 24, 24, 0.35);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.05s ease;
  user-select: none;
  pointer-events: auto;
  cursor: pointer;
}

.avatar-section:hover .avatar-overlay,
.avatar-section:focus .avatar-overlay {
  opacity: 1;
  scale: 1.02;
}

.edit-icon {
  width: 36px;
  height: 36px;
  color: #fff;
  stroke-width: 2.5;
}

.avatar-upload {
  display: none;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 64px;
  margin-top: -10px;
}

.user-form .form-group input {
  width: 220px;
}

.user-contact-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.form-group input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  border-color: #3b82f6;
  outline: none;
  background-color: #f0f9ff;
}

.actions {
  text-align: right;
  margin: 1.5rem 0 2rem;
}

.save-button {
  padding: 0.6rem 1.4rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-button:hover {
  background-color: #2563eb;
}

.bookings-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #444;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.booking-name {
  font-weight: 600;
  font-size: 1rem;
  color: #222;
}

.booking-time {
  font-size: 0.9rem;
  color: #555;
}
</style>
