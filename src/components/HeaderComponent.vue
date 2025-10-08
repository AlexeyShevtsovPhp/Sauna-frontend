<!-- src/components/HeaderComponent.vue -->
<template>
  <header class="header">
    <div class="header-content">
      <h1>🔥 Найди свою идеальную баню — отдыхай по кайфу! 🧖‍♂️</h1>
      <nav class="header-nav">
        <ul>
          <li><router-link to="/main">Главная</router-link></li>
          <li><router-link to="/about">О нас</router-link></li>
          <li class="contacts-with-avatar">
            <a href="#contact">Контакты</a>
            <img
                :src="avatar || '/default-avatar.png'"
                alt="Личный кабинет"
                class="user-avatar"
                @click="goToProfile"
                title="Личный кабинет"
                role="button"
                tabindex="0"
            />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { getNameAndAvatar } from '../requestJS/UserInfo.js';

export default {
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    goToProfile() {
      this.$router.push('/profile');
    },
    goToAbout() {
      this.$router.push('/about');
    }
  },
  mounted() {
    getNameAndAvatar().then(response => {
      if (response.success) {
        this.avatar = response.user.avatar;
      }
    });
  }
}
</script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-nav{
  margin-left: 1400px;
  position: absolute;
}

.contacts-with-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.main-content {
  padding-top: 3rem;
  padding-bottom: 85px;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content {
  max-width: 12000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
  .header-content,
  .footer-top {
    flex-direction: column;
    gap: 1rem;
  }

  .header-nav ul {
    flex-direction: column;
    gap: 1rem;
  }
}

.copyright {
  color: #bfb9b9;
  margin: 0;
}

.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1.5rem;
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

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.footer {
  background-color: #f8f9fa;
  padding: 2rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1.5rem;
}

.footer-section {
  flex: 1;
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

.sauna-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem 0;
}

.sauna-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sauna-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.sauna-image-placeholder {
  width: 100%;
  height: 120px;
  background-color: #eee;
  border-bottom: 1px solid #ddd;
}

.sauna-name {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .sauna-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .sauna-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sauna-grid {
    grid-template-columns: 1fr;
  }
}

.sauna-image-placeholder img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.footer {
  background: linear-gradient(135deg, #36454f, #596f7f);
  color: #dbe7f1;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 12px rgba(54,69,79,0.5);

  padding: 3rem 2rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: nowrap;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.footer-section {
  flex: 1;
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

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #cce9e9;
  gap: 1rem;
}

.social-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
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

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    gap: 1.5rem;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}


</style>
