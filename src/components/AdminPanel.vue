<template>
  <section class="admin-tools">
    <div class="container">
      <h2 class="title">⚙️ Панель разработчика ⚙️</h2>
      <div class="tabs-grid">
        <div class="tab" @click="goToUsers" tabindex="0" role="button" @keydown.enter="goToUsers" @keydown.space.prevent="goToUsers">
          Управление пользователями
        </div>
        <div class="tab" @click="goToSaunas" tabindex="0" role="button" @keydown.enter="goToSaunas" @keydown.space.prevent="goToSaunas">
          Управление банями
        </div>
        <div class="tab" @click="goToSettings" tabindex="0" role="button" @keydown.enter="goToSettings" @keydown.space.prevent="goToSettings">
          Настройки системы
        </div>
        <div class="tab" @click="goToReports" tabindex="0" role="button" @keydown.enter="goToReports" @keydown.space.prevent="goToReports">
          Отчёты и логи
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goToUsers() {
  router.push('/adminTools/users');
}
function goToSaunas() {
  router.push('/adminTools/saunas');
}
function goToSettings() {
  router.push('/adminTools/settings');
}
function goToReports() {
  router.push('/adminTools/reports');
}
</script>

<style scoped>
.admin-tools {
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 50px;
  text-align: center;
}

.tabs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.tab {
  background-color: white;
  padding: 30px 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tab:hover,
.tab:focus-visible {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  outline: none;
}

/* Адаптив */
@media (max-width: 768px) {
  .tabs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
