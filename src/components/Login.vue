<script setup>
import { login } from "../requestJS/Authorization.js";
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { ElNotification } from "element-plus";

const formRef = ref(null);
const form = reactive({
  name: '',
  password: ''
});

const rules = {
  name: [
    { required: true, message: 'Пожалуйста, введите логин', trigger: 'change' }
  ],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'change' }
  ]
};

const router = useRouter();

function goToRegistration() {
  router.push('/registration');
}

async function submitForm() {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const response = await login(form.name, form.password);

  if (response.success) {
    window.location.href = '/main';
  } else {
    ElNotification({
      title: 'Ошибка',
      message: 'Неверный логин или пароль',
      type: 'error',
    });
  }
}
</script>

<template>
  <div class="body-wrapper">
    <div class="container">
      <div class="form-container">
        <h1 class="title">
          Добро пожаловать<br />
          <span>в баню</span>
        </h1>

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

          <el-button
              type="primary"
              class="button-submit"
              native-type="submit"
          >
            Войти
          </el-button>
        </el-form>

        <p class="register-text">
          Нет аккаунта?
          <a href="/" @click.prevent="goToRegistration()">Зарегистрируйтесь</a>
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

body,
html,

.container {
  display: flex;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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
  background-color: #29c66b;
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
  background-color: #17b359;
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

</style>
