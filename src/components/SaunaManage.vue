<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { getSaunas } from '../requestJS/SaunaListFetch.js';
import { saunaInfo } from '../requestJS/SaunaInfo.js';
import { saunaUpdate, uploadPhoto, deletePhotoFromServer } from '../requestJS/UpdateSaunaData.js';
import { ElNotification } from 'element-plus';

const saunaList = ref([]);
const selectedSaunaId = ref(null);
const selectedPhotoIndex = ref(0);
const sauna = ref(null);
const isSaving = ref(false);
const photoInput = ref(null);
const tempPhotoFile = ref(null);
const isDeleteMode = ref(false);

const selectedSauna = computed(() => saunaList.value.find((s) => s.id === selectedSaunaId.value));

const editForm = reactive({
  description: '',
  images: [],
});

const isChanged = computed(() => {
  if (!sauna.value) return false;

  const descChanged = editForm.description !== sauna.value.description;
  const imagesChanged = !arraysEqual(editForm.images, sauna.value.pictures);

  return descChanged || imagesChanged;
});

async function selectSauna(id) {
  selectedSaunaId.value = id;
  selectedPhotoIndex.value = 0;

  const response = await saunaInfo(id);
  if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
    sauna.value = response.data[0];
    editForm.description = sauna.value.description || '';
    editForm.images = Array.isArray(sauna.value.pictures) ? [...sauna.value.pictures] : [];
  }
}

async function saveChanges() {
  if (!selectedSaunaId.value || !isChanged.value) return;

  isSaving.value = true;

    if (tempPhotoFile.value) {
      const uploadedUrl = await uploadPhoto(selectedSaunaId.value, tempPhotoFile.value);
      editForm.images[selectedPhotoIndex.value] = uploadedUrl;
      tempPhotoFile.value = null;
    }
    await saunaUpdate({
      id: selectedSaunaId.value,
      description: editForm.description,
      images: editForm.images,
    });

    if (sauna.value) {
      sauna.value.description = editForm.description;
      sauna.value.pictures = [...editForm.images];
    }

    ElNotification({
      title: 'Успешно',
      message: 'Изменения сохранены.',
      type: 'success',
      duration: 3000,
    });
  isSaving.value = false;
}

function triggerPhotoInput() {
  photoInput.value.click();
}

function arraysEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  return arr1.every((value, index) => value === arr2[index]);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    tempPhotoFile.value = file;
    editForm.images[selectedPhotoIndex.value] = URL.createObjectURL(file);
  }
}

function nextPhoto() {
  isDeleteMode.value = false;
  if (selectedPhotoIndex.value < editForm.images.length) {
    selectedPhotoIndex.value++;
  } else {
    selectedPhotoIndex.value = 0;
  }
}

function prevPhoto() {
  isDeleteMode.value = false;
  if (selectedPhotoIndex.value > 0) {
    selectedPhotoIndex.value--;
  } else {
    selectedPhotoIndex.value = editForm.images.length;
  }
}

function toggleDeleteMode() {
  isDeleteMode.value = !isDeleteMode.value;
}

function addPhoto() {
  nextTick(() => {
    triggerPhotoInput();
  });
}

async function removePhoto(index) {
  if (index < 0 || index >= editForm.images.length) return;

  const photoUrl = editForm.images[index];
    await deletePhotoFromServer(selectedSaunaId.value, photoUrl);

    editForm.images.splice(index, 1);

    if (selectedPhotoIndex.value >= editForm.images.length) {
      selectedPhotoIndex.value = Math.max(editForm.images.length - 1, 0);
    }

    ElNotification({
      title: 'Фото удалено',
      message: 'Фотография успешно удалена.',
      type: 'success',
      duration: 3000,
    });
    isDeleteMode.value = false;
}

onMounted(async () => {
  const response = await getSaunas();

  if (response.success) {
    saunaList.value = response.data.map((s) => ({
      ...s,
      preview: s.picture
          ? Array.isArray(s.picture)
              ? s.picture
              : [s.picture]
          : [],
    }));

    if (saunaList.value.length > 0) {
      await selectSauna(saunaList.value[0].id);
    }
  }
});
</script>

<template>
  <div class="bathhouse-manager">
    <div class="bathhouse-selector">
      <h2 class="selector-title">Бани</h2>
      <hr class="selector-separator" />
      <ul>
        <li
            v-for="sauna in saunaList"
            :key="sauna.id"
            :class="{ active: sauna.id === selectedSaunaId }"
            @click="selectSauna(sauna.id)"
        >
          <img :src="sauna.preview" alt="preview" />
          <span>{{ sauna.name }}</span>
        </li>
      </ul>
    </div>

    <div class="photo-editor">
      <h1 class="bathhouse-name">{{ selectedSauna?.name }}</h1>

      <div class="photo-gallery">
        <button @click="prevPhoto" class="nav-button left" aria-label="Назад">
          <img src="/images/back.png" alt="назад" class="arrow-icon" />
        </button>

        <div class="photo-wrapper">
          <template v-if="selectedPhotoIndex === editForm.images.length">
            <div class="add-photo" @click="addPhoto">
              <span>＋</span>
              <p>Добавить фото</p>
            </div>
          </template>

          <template v-else>
            <div class="photo-container" @click="toggleDeleteMode">
              <img
                  :src="editForm.images[selectedPhotoIndex]"
                  alt="photo"
                  class="main-photo"
                  :class="{ blurred: isDeleteMode }"
              />
              <button
                  v-if="isDeleteMode"
                  class="center-delete-button"
                  @click.stop="removePhoto(selectedPhotoIndex)"
              >
                🗑 Удалить фото
              </button>
            </div>
          </template>

          <input
              ref="photoInput"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="handlePhotoUpload"
              style="display: none;"
          />
        </div>

        <button @click="nextPhoto" class="nav-button right" aria-label="Вперёд">
          <img src="/images/back.png" alt="вперёд" class="arrow-icon" />
        </button>

      </div>
      <div class="photo-counter">
        <template v-if="selectedPhotoIndex === editForm.images.length">
          {{ editForm.images.length + 1 }} / {{ editForm.images.length + 1 }}
        </template>
        <template v-else>
          {{ selectedPhotoIndex + 1 }} / {{ editForm.images.length + 1 }}
        </template>
      </div>
      <div class="edit-form">
        <label>Описание:</label>
        <textarea v-model="editForm.description" rows="6" />
        <button class="save-button" :disabled="!isChanged" @click="saveChanges">
          {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bathhouse-manager {
  display: flex;
  height: 90vh;
  font-family: Arial, sans-serif;
  gap: 24px;
  padding: 10px 20px;
  background: #f9f9f9;
}

.bathhouse-selector {
  width: 360px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 84px 20px 24px;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.07);
  overflow-y: auto;
  position: relative;
  margin-left: -100px;
}

.selector-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  user-select: none;
  margin-top: -5px;
  margin-left: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.blurred {
  filter: blur(3px) brightness(0.6);
  transition: filter 0.3s ease;
}

.center-delete-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
  border: none;
  padding: 14px 24px;
  font-size: 18px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.center-delete-button:hover {
  background: rgba(192, 57, 43, 0.95);
}

.bathhouse-selector ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bathhouse-selector li {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
  height: 70px;
  width: 110%;
}

.bathhouse-selector li:hover {
  background-color: #d0f8d9;
  box-shadow: 0 2px 6px rgb(39 174 96 / 0.3);
}

.bathhouse-selector li.active {
  background-color: #27ae60;
  color: white;
  box-shadow: 0 4px 8px rgb(39 174 96 / 0.6);
}

.bathhouse-selector li.active span {
  font-weight: 700;
  color: white;
}

.bathhouse-selector img {
  width: 150px;
  height: 85px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.bathhouse-selector li span {
  display: block;
  flex-grow: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #2c3e50;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-overflow: clip;
}

.photo-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 24px 30px;
  border-radius: 12px;
  box-shadow: 0 6px 14px rgb(0 0 0 / 0.1);
  overflow-y: auto;
  min-width: 700px;
}

.bathhouse-name {
  font-size: 36px;
  font-weight: 900;
  margin-top: 5px;
  margin-left: 42px;
  color: #2c3e50;
  user-select: none;
  position: relative;
  padding-bottom: 5px;
  margin-bottom: 20px;
  letter-spacing: 0.04em;
  font-family: 'Segoe UI Semibold', Tahoma, Geneva, Verdana, sans-serif;
}

.bathhouse-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15px;
  width: 60px;
  height: 3px;
  background-color: #27ae60;
  border-radius: 2px;
}

.photo-gallery {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 620px;
}

.nav-button {
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
  opacity: 0.7;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, transform 0.2s ease;
  padding: 0;
  margin-left: 50px;
  z-index: 1000;
}

.nav-button:hover {
  opacity: 1;
  background: #ffffff;
  border: none;
  transform: translateY(-50%) scale(1.02);
}

.nav-button:focus {
  outline: none;
  box-shadow: none;
}

.nav-button.left {
  left: -1.9rem;
}

.nav-button.right {
  right: -1.2rem;
}

.nav-button.right .arrow-icon {
  transform: scaleX(-1);
}

.arrow-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
  display: block;
  margin: auto;
  user-select: none;
  pointer-events: none;
}

.photo-wrapper {
  position: relative;
  width: 600px;
  height: 375px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background: #eee;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
  margin-left: 40px;
}

.main-photo {
  width: 600px;
  height: 375px;
  object-fit: cover;
  border-radius: 14px;
  transition: transform 0.3s ease;
}

.add-photo {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #27ae60;
  font-size: 56px;
  font-weight: 700;
  user-select: none;
  transition: color 0.3s ease;
  height: 375px;
  width: 600px;
  border: 3px dashed #27ae60;
  border-radius: 14px;
}

.add-photo:hover {
  color: #1e8449;
}

.add-photo p {
  margin-top: 8px;
  font-weight: 600;
  font-size: 18px;
}

.photo-counter {
  font-weight: 600;
  color: #555;
  margin-left: -490px;
  margin-top: -10px;
}

.edit-form {
  width: 100%;
  max-width: 700px;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-left: 0;
}

.edit-form label {
  font-weight: 700;
  font-size: 20px;
  color: #aa911a;
  user-select: none;
  margin-bottom: 9px;
  margin-left: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.edit-form textarea {
  width: 100%;
  padding: 18px 20px;
  font-size: 18px;
  border-radius: 14px;
  border: 2px solid #ccc;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 180px;
  line-height: 1.6;
  background-color: #fcfcfc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  text-align: justify;
}

.edit-form textarea:focus {
  border-color: #27ae60;
  box-shadow: 0 0 10px rgba(39, 174, 96, 0.25);
  outline: none;
}

.save-button:disabled {
  background-color: #ccc !important;
  color: #888 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  transform: none !important;
  pointer-events: none !important;
}

.save-button {
  padding: 14px 20px;
  background-color: #27ae60;
  color: white;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.15s ease;
  align-self: flex-start;
  user-select: none;
}

.save-button:hover {
  background-color: #1e8449;
  transform: scale(1.05);
}

.selector-separator {
  border: none;
  height: 3px;
  width: 360px;
  background-color: #27ae60;
  border-radius: 4px;
  margin-left: -10px;
  margin-top: -15px;
  margin-bottom: 25px;
}
</style>
