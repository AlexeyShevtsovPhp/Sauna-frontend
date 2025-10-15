<template>
  <section class="contact-us">
    <div class="container">
      <h2 class="title">Свяжитесь с нами</h2>
      <div class="contact-info">
        <div class="contact-item">
          <img src="/images/phoneIcon.png" alt="Телефон" class="contact-icon-phone" />
          <div class="contact-details">
            <p class="label-phone">Телефон</p>
            <a href="tel:+1234567890" class="value">+375 (29) 846-89-06</a>
          </div>
        </div>

        <div class="contact-item">
          <img src="/images/mailIcon.png" alt="Email" class="contact-icon-mail" />
          <div class="contact-details">
            <p class="label-mail">Email</p>
            <a href="mailto:info@example.com" class="value">tyt.Homelsauna@mail.com</a>
          </div>
        </div>

        <div class="contact-item">
          <img src="/images/buildingIcon.png" alt="Адрес" class="contact-icon-address" />
          <div class="contact-details">
            <p class="label-address">Адрес</p>
            <p class="value">ул. Примерная, д. 123, Москва</p>
          </div>
        </div>

        <div class="contact-item">
          <img src="/images/speakerIcon.png" alt="Социальные сети" class="contact-icon-socials" />
          <div class="contact-details">
            <p class="label-socials">Социальные сети</p>
            <div class="social-links">
              <a href="#" class="social-icon" title="Facebook"><img src="/images/facebookIcon.png" alt="Facebook" /></a>
              <a href="#" class="social-icon" title="Twitter"><img src="/images/twitterIcon.png" alt="Twitter" /></a>
              <a href="#" class="social-icon" title="VK"><img src="/images/vkIcon.png" alt="VK" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.contact-us {
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

.contact-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.contact-item {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.contact-icon-phone {
  width: 45px;
  height: 45px;
  object-fit: cover;
  margin-top: 22px;
}

.contact-icon-mail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-top: 20px;
}

.contact-icon-address {
  width: 45px;
  height: 45px;
  object-fit: cover;
  margin-top: 38px;
}

.contact-icon-socials {
  width: 57px;
  height: 57px;
  object-fit: cover;
  margin-top: 29px;
  margin-left: 3px;
}

.contact-details .label-phone {
  font-size: 1rem;
  color: #777;
  margin-bottom: 5px;
  margin-left: -75px;
}

.contact-details .label-mail {
  font-size: 1rem;
  color: #777;
  margin-bottom: 8px;
  margin-left: -178px;
}

.contact-details .label-address {
  font-size: 1rem;
  color: #777;
  margin-bottom: 5px;
  margin-left: -205px;
}

.contact-details .label-socials {
  font-size: 1rem;
  color: #777;
  margin-left: -10px;
}

.contact-details .value {
  font-size: 1.1rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.contact-details .value:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 18px;
  margin-top: 5px;
}

.social-icon img {
  width: 36px; /* увеличено */
  height: 36px;
  transition: transform 0.3s ease;
}

.social-icon:hover img {
  transform: scale(1.15);
}

@media (max-width: 768px) {
  .contact-info {
    grid-template-columns: 1fr;
  }

  .contact-item {
    margin-bottom: 20px;
  }
}
</style>
