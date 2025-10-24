<script>
import {getNameAndAvatar} from '../requestJS/UserInfo.js';

export default {
  data() {
    return {
      avatar: '',
      role: '',
      name: '',
    }
  },
  methods: {
    goToProfile() {
      this.$router.push('/profile');
    },

    goToAdmin() {
      this.$router.push('/adminTools');
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
  mounted() {
    getNameAndAvatar().then(response => {
      if (response.success) {
        this.avatar = response.user.avatar;
        this.role = response.user.role;
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('avatar', response.user.avatar);
        localStorage.setItem('name', response.user.name);
      }
    });
  }
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <h1>🔥 Найди свою идеальную баню — отдыхай по кайфу! 🧖‍♂️</h1>
      <nav class="header-nav">
        <ul>
          <li>
            <router-link to="/main">Главная</router-link>
          </li>
          <li>
            <router-link to="/about">О нас</router-link>
          </li>
          <li>
            <router-link to="/contacts">Контакты</router-link>
          </li>
          <li>
            <router-link to="/payment">Брони</router-link>
          </li>
          <li class="contacts-with-avatar">
            <img
                :src="avatar || '/default-avatar.png'"
                alt="Личный кабинет"
                class="user-avatar"
                @click="goToProfile"
                title="Личный кабинет"
                role="button"
                tabindex="0"
            />
            <img
                src="/images/logout.png"
                alt="Выход"
                class="logout-icon"
                @click="logout"
                title="Выйти"
                role="button"
                tabindex="0"
            />
            <img
                v-if="role === 'admin'"
                src="/images/adminTool.png"
                alt="Панель разработчика"
                class="developer-icon"
                @click="goToAdmin"
                title="Панель разработчика"
                role="button"
                tabindex="0"
            />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>

.developer-icon {
  width: 43px;
  height: 43px;
  margin-left: -305px;
  margin-top: -3px;
  cursor: pointer;
  border-radius: 6px;
  position: absolute;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.developer-icon:hover {
  transform: scale(1.1);
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-nav {
  margin-left: 1330px;
  position: absolute;
}

.contacts-with-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: -105px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  margin-left: 100px;
  margin-top: -3px;

  position: absolute;
  border-radius: 50%;
  padding: 3px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  border: 2px solid transparent;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12));
  transition: filter 0.3s ease;
}

.user-avatar:hover {
  box-shadow: 0 8px 20px rgba(107, 167, 232, 0.5);
  border-color: #6ba7e8;
  transform: scale(1.07);
}

.user-avatar:hover img {
  filter: drop-shadow(0 2px 4px rgba(107, 167, 232, 0.6));
}

.header-content {
  max-width: 12000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.logout-icon {
  position: absolute;
  width: 57px;
  height: 57px;
  margin-left: 172px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logout-icon:hover {
  transform: scale(1.1);
}

h1 {
  font-size: 1.5rem;
  color: #222;
  margin: 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: transform 0.3s ease;
}

h1:hover {
  transform: scale(1.01);
}

.header-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 2rem;

}

.header-nav a {
  color: #333333;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }

  &:active {
    color: #0056b3;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header-nav ul {
    flex-direction: column;
    gap: 1rem;
  }
}

.social-links a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #007bff;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #007bff;
}

.footer-section h3 {
  margin-top: 0;
  color: #333;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #007bff;
}

.sauna-image-placeholder img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.footer-section h3 {
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #e0f7f7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.footer-section li {
  margin-bottom: 0.7rem;
  font-size: 1rem;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.footer-section a {
  color: #d0f0f0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #ffdd57;
  text-decoration: underline;
}

.social-links a {
  font-size: 1.5rem;
  color: #d0f0f0;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  text-decoration: none;
}

.social-links a:hover {
  color: #ffdd57;
  background: #fff8cc;
  transform: scale(1.2);
  box-shadow: 0 0 8px #ffdd57;
}

</style>
