<script>
import HeaderComponent from './HeaderComponent.vue';
import FooterComponent from './FooterComponent.vue';

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
};
</script>

<template>
  <div>
    <HeaderComponent />
    <main class="main-content">
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped>
.main-content {
  padding-top: 3rem;
  padding-bottom: 85px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
