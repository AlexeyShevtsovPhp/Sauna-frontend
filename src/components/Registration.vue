<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registration } from '../requestJS/Registration.js';
import { ElNotification } from 'element-plus';
import { reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const formRef = ref(null);

const rules = {
  name: [
    { required: true, message: 'Пожалуйста, введите логин', trigger: 'change' }
  ],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'change' }
  ],
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'change' },
  ]
};

const router = useRouter();

function goToLogin() {
  router.push('/login');
}


async function submitForm() {

  const valid = await formRef.value.validate();
  if (!valid) return;

  const response = await registration(form.name, form.password, form.email);

  if (response.success) {
    await router.push('/main');
  } else if (response.errors) {
    const firstError = Object.values(response.errors)[0][0];

    ElNotification({
      title: 'Ошибка',
      message: firstError,
      type: 'error',
      duration: 3000,
    });
  }
}

</script>

<template>
  <div class="body-wrapper">
    <div class="container">
      <div class="form-container">
        <h1 class="title">Регистрация</h1>

        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="0"
            class="login-form"
            @submit.prevent="submitForm"
        >
          <el-form-item prop="name">
            <el-input
                v-model="form.name"
                placeholder="Логин"
                class="custom-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="Пароль"
                class="custom-input"
            />
          </el-form-item>
            <el-form-item prop="email">
              <el-input
                  v-model="form.email"
                  placeholder="Email"
                  class="custom-input"
              />
            </el-form-item>

            <el-button
                type="primary"
                class="button-submit"
                @click="submitForm"
            >
              Регистрация
            </el-button>
        </el-form>

        <p class="register-text">
          Уже есть аккаунт?
          <a href="/" @click.prevent="goToLogin">Войти</a>
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
  gap: 7px;
}

.custom-input ::v-deep(.el-input__inner) {
  padding: 14px 18px;
  font-size: 1.15rem;
  height: 52px;
  border-radius: 4px;
  margin-left: -12px;
  margin-right: -12px;
  transition: border-color 0.35s ease;
}

.custom-input ::v-deep(.el-input__inner:focus) {
  border-color: #27ae60;
  outline: none;
  box-shadow: 0 0 6px rgba(39, 174, 96, 0.4);
}

.button-submit {
  padding: 16px;
  font-size: 1.15rem;
  background-color: #e3a901;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.35s ease;
  width: 400px;
  height: 52px;
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

</style>



