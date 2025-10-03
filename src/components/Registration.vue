<script>
import {registration} from "../requestJS/Registration.js";

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      showSuccess: false,
      showNameTaken: false,
      showError: false,
      errorMessage: '',
    }
  },
  methods: {
    async submitForm() {
      this.showSuccess = false;
      this.showNameTaken = false;
      this.showError = false;

      const response = await registration(this.name, this.password, this.email);

      if (response.success) {

        this.showSuccess = true;
        this.name = '';
        this.password = '';
        this.email = '';

        this.$router.push('/main');

        setTimeout(() => (this.showSuccess = false), 3000);
      } else if (response.errors) {
        this.showError = true;
        this.errorMessage = Object.values(response.errors)[0][0];
        setTimeout(() => (this.showError = false), 3000);
      } else {
        this.showError = true;
        setTimeout(() => (this.showError = false), 3000);
      }
    },

    goToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>

<template>
  <div class="body-wrapper">
  <div class="container">
    <div class="form-container">

      <div
          class="notification-wrong"
          v-if="showError"
      >
        {{ errorMessage }}
      </div>

      <h1 class="title">
        Регистрация
      </h1>
      <form @submit.prevent="submitForm" class="login-form">
        <input type="text" placeholder="Имя пользователя" v-model="name" />
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Пароль" v-model="password" />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p class="register-text">
        Уже есть аккаунт? <a href="/" @click.prevent="goToLogin()">Войти</a>
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
  height: 100%;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: #e8f0f2;
  overflow: hidden;
}

.container {
  display: flex;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  overflow: hidden;
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

.title {
  font-size: 2.2rem;
  margin-bottom: 30px;
  margin-left: 8px;
  font-weight: 700;
  user-select: none;
  background: linear-gradient(to right, #f1a70e, #1b1a1a);
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
  border-color: #d6a106;
  outline: none;
}

.login-form button {
  padding: 16px;
  font-size: 1.15rem;
  background-color: #e3a901;
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
  background-color: #c39203;
}

.register-text {
  margin-top: 22px;
  font-size: 1rem;
  color: #7f8c8d;
  user-select: none;
}

.register-text a {
  color: #dca609;
  text-decoration: none;
  font-weight: 600;
}

.register-text a:hover {
  text-decoration: underline;
}

.image-container {
  flex: 1;
  min-width: 450px;
  background-image: url('/images/Banya4Reg.jpg');
  background-size: cover;
  background-position: center;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  user-select: none;
}

.notification {
  position: fixed;
  top: 7%;
  left: 89.7%;
  transform: translate(-50%, -50%);
  max-width: 350px;
  width: 90vw;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-in 2.7s forwards;
  z-index: 1000;
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



