<script>
import {login} from "../requestJS/Authorization.js";

export default {
  data() {
    return {
      name: '',
      password: '',
      showError: false,
      errorMessage: ''
    }
  },
  methods: {
    goToRegistration() {
      this.$router.push('/registration');
    },

    async submitForm() {
      const response = await login(this.name, this.password);

      if (response.success) {
        window.location.href = '/main';
      } else if (response.errors) {
        this.showError = true;
        this.errorMessage = String(Object.values(response.errors)[0]);
        setTimeout(() => (this.showError = false), 3000);
      } else {
        this.showError = true;
        this.errorMessage = 'Неверный логин или пароль';

        this.name = '';
        this.password = '';

        setTimeout(() => (this.showError = false), 3000);
      }
    }
  }
}

</script>

<template>
  <div class="body-wrapper">
  <div class="container">

    <div
        class="notification-wrong"
        v-show="showError"
        style="display: block;"
    >
      {{ errorMessage }}
    </div>

    <div class="form-container">
      <h1 class="title">
        Добро пожаловать<br /><span>в баню</span>
      </h1>
      <form @submit.prevent="submitForm" class="login-form">
        <input type="text" placeholder="Логин" v-model="name" />
        <input type="password" placeholder="Пароль" v-model="password" />
        <button type="submit">Войти</button>
      </form>
      <p class="register-text">
        Нет аккаунта? <a href="/" @click.prevent="goToRegistration()">Зарегистрируйтесь</a>
      </p>
    </div>
    <div class="image-container"></div>
  </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  box-sizing: border-box;
}

body, html, #app {
  min-height: 100vh;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: #e8f0f2;
  overflow-x: hidden;
}


.container {
  display: flex;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border-radius: 14px;
}

.form-container {
  flex: 1;
  padding: 50px 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.body-wrapper {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 105vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}


.title {
  font-size: 1.9rem;
  color: #34495e;
  margin-bottom: 30px;
  margin-left: 4px;
  font-weight: 600;
  line-height: 1.3;
  user-select: none;
}

.title span {
  display: block;
  margin-left: -15px;
  font-size: 2.4rem;
  color: #27ae60;
  font-weight: 700;
  margin-top: 8px;
  user-select: none;
  background: linear-gradient(to right, #15dc25, #252424);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form input {
  padding: 14px 18px;
  font-size: 1.15rem;
  border: 2.5px solid #bdc3c7;
  border-radius: 8px;
  transition: border-color 0.35s ease;
  font-family: 'Poppins', sans-serif;
}

.login-form input:focus {
  border-color: #27ae60;
  outline: none;
}

.login-form button {
  padding: 16px;
  font-size: 1.15rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.35s ease;
  width: 400px;
  align-self: flex-start;
  font-weight: 600;
  user-select: none;
}

.login-form button:hover {
  background-color: #1e8449;
}

.register-text {
  margin-top: 22px;
  font-size: 1rem;
  color: #7f8c8d;
  user-select: none;
}

.register-text a {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
}

.register-text a:hover {
  text-decoration: underline;
}

.image-container {
  flex: 1;
  min-width: 450px;
  background-image: url('/images/Banya.jpg');
  background-size: cover;
  background-position: center;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  user-select: none;
}

.notification-wrong {
  position: fixed;
  top: 7%;
  left: 91%;
  transform: translate(-50%, -50%);
  max-width: 305px;
  width: 90vw;
  padding: 15px;
  background-color: #c50e0e;
  color: white;
  border-radius: 4px;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards,
  fadeOut 0.3s ease-in 2.7s forwards;
  z-index: 1000;
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}


</style>
