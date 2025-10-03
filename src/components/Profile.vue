<script>
import { getUserProfileInfo } from '../requestJS/UserInfo.js';
import { updateUser } from '../requestJS/UpdateUser.js';
import { uploadAvatar } from "../requestJS/UploadAvatar.js";

export default {
  name: 'UserProfile',
  data() {
    return {
      profile: {
        name: '',
        lastName: '',
        middleName: '',
        avatar: '',
        email: '',
        phone: '',
        address: '',
      },
      bookings: [
        { id: 1, saunaName: 'Сауна «Березка»', time: '12:00 - 14:00' },
        { id: 2, saunaName: 'Сауна «Лесная»', time: '16:00 - 18:00' },
        { id: 3, saunaName: 'Сауна «Водопад»', time: '20:00 - 22:00' },
      ],
      selectedBookingId: null,
      notification: '',
      notificationType: '',
      initialProfileData: {},
    };
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification = message;
      this.notificationType = type;

      this.$nextTick(() => {
        const notificationElement = document.querySelector('.notification');
        notificationElement.classList.add('show');
        notificationElement.classList.remove('hide');
      });

      setTimeout(() => {
        const notificationElement = document.querySelector('.notification');
        notificationElement.classList.add('hide');
        setTimeout(() => {
          this.notification = '';
        }, 200);
      }, 3000);
    },

    selectBooking(id) {
      this.selectedBookingId = id;
    },

    saveProfile() {
      const userData = {
        name: this.profile.name || '',
        lastName: this.profile.lastName || '',
        middleName: this.profile.middleName || '',
        email: this.profile.email || '',
        phone: this.profile.phone || '',
        address: this.profile.address || '',
      };

      let avatarUpdated = false;

      if (this.tempAvatar) {
        avatarUpdated = true;
        uploadAvatar(this.tempAvatar)
            .then(() => updateUser(userData))
            .then((response) => {
              console.log(response);
              if (avatarUpdated) {
                window.location.reload();
              } else {
                this.showNotification('Изменения сохранены', 'success');
                this.initialProfileData = { ...this.profile };
              }
            })
            .catch((error) => {
              console.log(error);
              this.showNotification('Ошибка при обновлении профиля', 'error');
            });
      } else {
        updateUser(userData)
            .then((response) => {
              console.log(response);
              this.showNotification('Изменения сохранены', 'success');
              this.initialProfileData = { ...this.profile };
            })
            .catch((error) => {
              console.log(error);
              this.showNotification('Ошибка при обновлении профиля', 'error');
            });
      }
    },

    triggerFileInput() {
      this.$refs.avatarInput.click();
    },

    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.tempAvatar = file;
        this.profile.avatar = URL.createObjectURL(file);
      }
    },
  },

  mounted() {
    getUserProfileInfo().then((response) => {
      if (response.success) {
        this.initialProfileData = { ...response.user };
        this.profile = { ...this.initialProfileData };
      }
    });
  },

  computed: {
    isProfileChanged() {
      return JSON.stringify(this.profile) !== JSON.stringify(this.initialProfileData);
    },
  },
};
</script>

<template>
  <transition>
    <div v-if="notification" class="notification" :class="notificationType">
      {{ notification }}
    </div>
  </transition>

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
    <div class="bookings-list">
      <div
          v-for="booking in bookings"
          :key="booking.id"
          class="booking-card"
          @click="selectBooking(booking.id)"
          :class="{ selected: booking.id === selectedBookingId }"
          tabindex="0"
          role="button"
      >
        <div class="booking-name">{{ booking.saunaName }}</div>
        <div class="booking-time">{{ booking.time }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 136px;
  right: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  background-color: #4caf50;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  animation: none;
  transition: opacity 0.3s ease, visibility 0s 0.3s;
}

.notification.error {
  background-color: #f44336;
}

.notification.success {
  background-color: #4caf50;
}

.notification.show {
  opacity: 1;
  visibility: visible;
  animation: fadeIn 0.2s forwards;
}

.notification.hide {
  animation: fadeOut 0.2s forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.save-button:disabled,
.button-disabled {
  background-color: #e2e8f0;
  color: #9ca3af;
  cursor: not-allowed;
  pointer-events: none;
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
