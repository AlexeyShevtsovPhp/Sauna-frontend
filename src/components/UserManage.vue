<script setup>
import { ref, computed, onMounted } from 'vue';
import { getUsers, deleteUser } from "../requestJS/UserList.js";
import { ElNotification } from 'element-plus';
import { getProfileBooking4Admin, deleteBooking } from "../requestJS/Booking.js";
import { getUserProfile4Admin } from '../requestJS/UserInfo.js';
import { blockUser, unblockUser }  from '../requestJS/UserList.js';

const users = ref([]);
const selectedUserId = ref(null);
const selectedUser = ref(null);
const bookings = ref([]);
const selectedBookingId = ref(null);
const isAdmin = computed(() => selectedUser.value?.role === 'admin');

const defaultAvatar = '/default-avatar.png';

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

onMounted(async () => {
  const response = await getUsers();
  if (response.success && Array.isArray(response.users)) {
    users.value = response.users;
    if (users.value.length > 0) {
      await selectUser(users.value[0].id);
    }
  }
});

async function selectUser(id) {
  selectedUserId.value = id;
  const userResponse = await getUserProfile4Admin(id);
  if (userResponse.success) {
    selectedUser.value = userResponse.user;
  }
  await fetchBookings(id);
  selectedBookingId.value = null;
}

async function fetchBookings(userId) {
  bookings.value = await getProfileBooking4Admin(userId) || [];
}

function editUser() {
  alert(`Редактирование пользователя: ${selectedUser.value.name}`);
}

async function deleteUserById(userId) {
  const response = await deleteUser(userId);
  if (response.status === 204) {
    users.value = users.value.filter(user => user.id !== userId);
    await loadUsers();
    await selectUser(users.value[0].id);
    ElNotification({
      message: 'Пользователь удален',
      type: 'success',
      offset: 50,
      duration: 3000,
    });
  } else {
    ElNotification({
      message: 'Ошибка при удалении пользователя',
      type: 'error',
      offset: 50,
      duration: 3000,
    });
  }
}

async function toggleBlockUser() {
  if (!selectedUserId.value) return;

  if (selectedUser.value.blocked) {
    const response = await unblockUser(selectedUserId.value);
    if (response.status === 204) {
      selectedUser.value.blocked = false;
      ElNotification({
        message: 'Пользователь разблокирован',
        type: 'success',
        offset: 50,
        duration: 3000,
      });
    } else {
      ElNotification({
        message: 'Ошибка при разблокировке пользователя',
        type: 'error',
        offset: 50,
        duration: 3000,
      });
    }
  } else {
    const response = await blockUser(selectedUserId.value);
    if (response.status === 204) {
      selectedUser.value.blocked = true;
      ElNotification({
        message: 'Пользователь заблокирован',
        type: 'success',
        offset: 50,
        duration: 3000,
      });
    } else {
      ElNotification({
        message: 'Ошибка при блокировке пользователя',
        type: 'error',
        offset: 50,
        duration: 3000,
      });
    }
  }
}

async function loadUsers() {
  const response = await getUsers();
  if (response.success && Array.isArray(response.users)) {
    users.value = response.users;
  }
}


function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDate(datetimeStr) {
  const date = new Date(datetimeStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function selectBooking(id) {
  selectedBookingId.value = selectedBookingId.value === id ? null : id;
}

async function removeBooking(id) {
  await deleteBooking(id);
  if (selectedBookingId.value === id) {
    selectedBookingId.value = null;
  }
  await fetchBookings(selectedUserId.value);
  ElNotification({
    message: 'Бронирование удалено',
    type: 'success',
    offset: 50,
    duration: 3000,
  });
}
</script>

<template>
  <div class="admin-users">
    <aside class="sidebar">
      <h2>Пользователи</h2>
      <ul>
        <li
            v-for="user in users"
            :key="user.id"
            :class="{ active: user.id === selectedUserId }"
            @click="selectUser(user.id)"
            tabindex="0"
            @keydown.enter="selectUser(user.id)"
            role="button"
            :aria-pressed="user.id === selectedUserId"
        >
          <img :src="user.avatar || defaultAvatar" alt="Аватар пользователя" class="avatar" />
          <div class="user-info">
            <p class="name">{{ user.name }}</p>
            <p class="email">{{ user.email }}</p>
          </div>
        </li>
      </ul>
    </aside>

    <main class="details">
      <template v-if="selectedUser">
        <div class="user-profile-page">
          <form class="user-profile-card">
            <div class="avatar-section">
              <img :src="selectedUser?.avatar || defaultAvatar" alt="Аватар пользователя" class="avatar" />
            </div>

            <div class="user-info">
              <div class="fio-group">
                <div class="form-group">
                  <label>Имя</label>
                  <input
                      type="text"
                      :value="selectedUser?.name || 'Пусто'"
                      readonly
                      :class="{ empty: !selectedUser?.name }"
                  />
                </div>
                <div class="form-group">
                  <label>Фамилия</label>
                  <input
                      type="text"
                      :value="selectedUser?.lastName || 'Пусто'"
                      readonly
                      :class="{ empty: !selectedUser?.lastName }"
                  />
                </div>
                <div class="form-group">
                  <label>Отчество</label>
                  <input
                      type="text"
                      :value="selectedUser?.middleName || 'Пусто'"
                      readonly
                      :class="{ empty: !selectedUser?.middleName }"
                  />
                </div>
              </div>

              <div class="bottom-row">
                <div class="form-group half-width">
                  <label>Почта</label>
                  <input
                      type="text"
                      :value="selectedUser?.email || 'Пусто'"
                      readonly
                      :class="{ empty: !selectedUser?.email }"
                  />
                </div>
                <div class="form-group half-width">
                  <label>Роль</label>
                  <input
                      type="text"
                      :value="selectedUser?.role || 'Пусто'"
                      readonly
                      :class="{ empty: !selectedUser?.role }"
                  />
                </div>
              </div>
            </div>
          </form>

          <div class="actions">
            <button
                @click="toggleBlockUser"
                :disabled="isAdmin"
                :class="{ disabled: isAdmin, blocked: selectedUser?.blocked }">
              {{ selectedUser?.blocked ? 'Разблокировать' : 'Заблокировать' }}
            </button>


            <button @click="deleteUserById(selectedUserId)" class="danger" :disabled="isAdmin" :class="{ disabled: isAdmin }">
              Удалить
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
      <template v-else>
        <p class="empty-state">Выберите пользователя из списка слева</p>
      </template>
    </main>
  </div>
</template>

<style scoped>
.admin-users {
  display: flex;
  height: 85vh;
  background: #f5f7fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

button.disabled {
  background-color: #bbb !important;
  cursor: not-allowed;
  box-shadow: none !important;
  color: #666 !important;
  pointer-events: none;
}

.sidebar {
  width: 350px;
  background: #fff;
  padding: 20px 15px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.sidebar h2 {
  margin-bottom: 20px;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.6rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

.sidebar li.active {
  background: #a7c1f8;
  color: white;
  box-shadow: 0 6px 15px rgba(156, 206, 241, 0.4);
}

.sidebar li.active .email {
  color: #1d1e20;
}

.sidebar li:hover:not(.active),
.sidebar li:focus-visible:not(.active) {
  background-color: #ecf6fc;
  outline: none;
}

.actions button.blocked {
  background-color: #f1c40f;
  color: #2c3e50;
  box-shadow: 0 4px 10px rgba(241, 196, 15, 0.5);
}

.actions button.blocked:hover {
  background-color: #d4ac0d;
}


.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
}

.name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.email {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  margin-top: -20px;
}

.details {
  flex-grow: 1;
  padding: 40px 30px;
  background: white;
  border-radius: 0 12px 12px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

input.empty {
  color: #7f8c8d;
  opacity: 0.6;
}

.half-width {
  flex: 1;
}

@media (max-width: 600px) {
  .user-profile-card {
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
  }

  .user-info {
    width: 100%;
  }
}

.user-card h2 {
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 1.8rem;
  color: #34495e;
}

.user-card p {
  font-size: 1.1rem;
  margin: 8px 0;
  color: #2c3e50;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.actions button {
  padding: 12px 28px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  background: #3498db;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.actions button:hover {
  background: #2980b9;
}

.actions button.danger {
  background: #e74c3c;
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
}

.actions button.danger:hover {
  background: #c0392b;
}

.empty-state {
  font-size: 1.2rem;
  color: #7f8c8d;
  text-align: center;
  margin-top: 150px;
  font-style: italic;
}

.sidebar::-webkit-scrollbar,
.details::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-thumb,
.details::-webkit-scrollbar-thumb {
  background-color: rgba(52, 152, 219, 0.3);
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-track,
.details::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

@media (max-width: 900px) {
  .admin-users {
    flex-direction: column;
    height: auto;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .details {
    border-radius: 0 0 12px 12px;
    padding: 20px;
  }
}

.sidebar li.active {
  background: #a7c1f8;
  color: white;
  box-shadow: 0 6px 15px rgba(156, 206, 241, 0.4);
}

.sidebar li:hover:not(.active),
.sidebar li:focus-visible:not(.active) {
  background-color: #ecf6fc;
  outline: none;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #ddd;
  flex-shrink: 0;
}

.sidebar-user-info .name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.sidebar-user-info .email {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.user-profile-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 60px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.avatar-section {
  width: 225px;
  height: 225px;
  border-radius: 50%;
  background: #ddd;
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
  position: absolute;
  margin-left: 25px;
}

.avatar-section img.avatar {
  width: 225px;
  height: 225px;
  object-fit: cover;
  border-radius: 50%;
  user-select: none;
  pointer-events: none;
  position: absolute;
  margin-left: -115px;
}

.fio-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 350px;
  margin-left: 300px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 6px;
  color: #34495e;
  user-select: none;
}

.form-group input[readonly] {
  background-color: #f5f7fa;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 1rem;
  color: #2c3e50;
  cursor: default;
  outline: none;
  box-shadow: none;
}

input.empty {
  color: #7f8c8d;
  opacity: 0.6;
}

.bottom-row {
  gap: 50px;
  margin-top: 10px;
  margin-left: 100px;
  width: 550px;
}

.half-width {
  flex: 1;
}

@media (max-width: 600px) {
  .user-profile-card {
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
  }
}

.bottom-row {
  margin-left: 100px;
  margin-top: 10px;
  gap: 65px;
  display: flex;
  max-width: 650px;
}

.bottom-row .half-width:first-child {
  flex: 1.5;
  min-width: 300px;
}

.bottom-row .half-width:last-child {
  flex: 1;
  min-width: 120px;
}

.booking-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  min-height: 50px;
  border-radius: 6px;
  background-color: #f2f4f7;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: 0.2s ease all;
  gap: 1rem;
}

.booking-card:hover {
  background-color: #e3f2fd;
}

.booking-card.selected {
  background-color: #bbdefb;
  border-color: #64b5f6;
}

.booking-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #4a4f55;
}

.booking-time, .booking-date {
  font-size: 0.9rem;
  color: #555;
}

.delete-booking-button {
  align-self: flex-start;
  margin-top: 8px;
  padding: 6px 12px;
  border: none;
  background-color: #e53935;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.delete-booking-button:hover {
  background-color: #b71c1c;
}

.bookings-list-wrapper {
  max-height: calc(5 * 56px + 4 * 20px);
  overflow-y: auto;
  border-radius: 8px;
  padding: 12px;
  background-color: #f9fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e3e7;
}

.bookings-list-wrapper {
  max-height: calc(5 * 56px);
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.25rem;
  background-color: #fafafa;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #f9faff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  font-size: 0.9rem;
  color: #acbae6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.booking-card.selected {
  background-color: #dfeaf8;
  box-shadow: 0 0 6px #4d81f1;
}

.booking-card:hover {
  background-color: #dbeafe;
}

.booking-name {
  flex: 0 1 40%;
}

.booking-date {
  flex: 0 0 25%;
  text-align: right;
  font-size: 0.85rem;
  color: #4b5563;
  white-space: nowrap;
}

.bookings-list-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(37, 99, 235, 0.5);
  border-radius: 4px;
}

</style>
