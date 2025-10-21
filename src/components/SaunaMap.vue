<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import { saunaCoordinates } from '../requestJS/SaunaInfo.js'
import { useRoute } from 'vue-router';

const route = useRoute();
const mapContainer = ref(null);
const saunaCoords = ref(null);

onMounted(() => {

  const saunaId = route.params.id;

  saunaCoordinates(saunaId).then(response => {
    if (response.status === 200) {
      saunaCoords.value = [response.data.latitude, response.data.longitude];

      const map = L.map(mapContainer.value).setView(saunaCoords.value, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker(saunaCoords.value)
          .addTo(map)
          .openPopup();
    }
  });
});
</script>

<template>
  <h2 class="map-title">Сауна на карте</h2>
  <div class="map-wrapper">
    <div ref="mapContainer" class="leaflet-map"></div>
  </div>
</template>

<style scoped>
.map-wrapper {
  border-radius: 20px;
  padding: 4px;
  background: linear-gradient(135deg, #fdf6d8 0%, #b6d89f 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 1200px;
  margin: auto;
  overflow: hidden;
  height: 500px;
}

.leaflet-map {
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.map-title {
  max-width: 1200px;
  margin: 3rem auto 1rem;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  font-size: 2.0rem;
  color: #4a4a4a;
  text-align: center;
  user-select: none;
}

</style>

