<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();

function goToMain() {
  router.push('/main');
}

</script>

<template>
  <div>
    <section class="about-section" aria-label="О нас">
      <div class="scroll-background"></div>
      <div class="scroll-wrapper" role="region" aria-live="polite">
        <h2>О нас</h2>
        <p>
          Мы рады представить вам наши уютные бани, расположенные по всему городу Гомель. Наши сауны — это идеальное
          место для отдыха и восстановления сил после трудового дня.
          Независимо от того, ищете ли вы место для семейного отдыха или хотите провести время с друзьями, у нас
          найдется идеальная баня именно для вас.
          Комфорт, чистота и внимательное обслуживание — наши главные приоритеты.
        </p>
        <p>
          Все наши сауны оснащены современным оборудованием, обеспечивают максимальный уют и безопасность.
          Вы можете выбрать баню с бассейном, джакузи, камином или зоной для отдыха — всё, чтобы сделать ваше время
          максимально приятным и расслабляющим.
        </p>
        <p>
          Мы гордимся тем, что предоставляем услуги на высшем уровне и постоянно расширяем наш ассортимент, чтобы
          удовлетворить все ваши пожелания.
          Приходите к нам и почувствуйте настоящую атмосферу уюта и тепла, которая дарит только настоящая баня.
        </p>

        <button class="select-bath-btn" @click="goToMain">Выбрать баню</button>

      </div>
    </section>

    <router-link to="/main" class="btn-select-bathhouse" aria-label="Выбрать баню">
      Выбрать баню
    </router-link>

  </div>
</template>

<style scoped>
.about-section {
  position: relative;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Georgia', serif;
  color: #3e2f1c;
  overflow: hidden;
  text-align: center;
}

.scroll-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/AboutBackground.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.60) contrast(1.1) saturate(1.2);
  z-index: 1;
}

.scroll-wrapper {
  max-width: 720px;
  background: linear-gradient(135deg, #fdf6d8 0%, #f9e79f 100%);
  border: 10px solid #e6d7a7;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  padding: 2rem 3.5rem;
  font-size: 1.15rem;
  line-height: 1.7;
  font-style: italic;
  font-weight: 500;
  font-family: 'Papyrus', 'Georgia', serif;
  z-index: 10;
  user-select: text;
  text-align: justify;
}

.scroll-wrapper h2 {
  text-align: center;
  font-family: 'Georgia', serif;
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1.4rem;
  color: #6e5823;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.75);
}

.scroll-wrapper p {
  margin-bottom: 1.2rem;
}

.select-bath-btn {
  background: linear-gradient(135deg, #e6d7a7, #d2c07a);
  border: 2px solid #6e5823;
  border-radius: 20px;
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-family: 'Georgia', serif;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 2px 2px 8px rgba(110, 88, 35, 0.5);
  color: #3e2f1c;
  margin-left: 252px;
}

.select-bath-btn:hover {
  background: linear-gradient(135deg, #d2c07a, #efc957);
  box-shadow: 3px 3px 12px rgba(110, 88, 35, 0.7);
}
</style>
