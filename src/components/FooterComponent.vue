<!-- src/components/FooterComponent.vue -->
<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-section">
          <h3>Информация</h3>
          <ul>
            <li><a href="#about">О компании</a></li>
            <li><a href="#services">Услуги</a></li>
            <li><a href="#blog">Блог</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Контакты</h3>
          <ul>
            <li>📞 +375 (29) 846-89-06</li>
            <li>✉️ tyt.Homelsauna@mail.com</li>
            <li>📍 Москва, ул. Примерная, 123</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">© 2025 Ваш сайт. Все права защищены.</p>
        <ul class="social-links">
          <li><a href="#" title="Вконтакте" aria-label="Вконтакте">🔵</a></li>
          <li><a href="#" title="Instagram" aria-label="Instagram">📸</a></li>
          <li><a href="#" title="Facebook" aria-label="Facebook">📘</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
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
  position: relative;
  z-index: 100;

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
