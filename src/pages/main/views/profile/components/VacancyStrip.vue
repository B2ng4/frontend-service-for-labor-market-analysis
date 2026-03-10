<template>
  <section class="vacancy-strip">
    <h3 class="vacancy-strip__title">{{ title }}</h3>
    <div class="vacancy-strip__scroll">
      <div class="vacancy-strip__list">
        <vacancy-card
          v-for="(item, idx) in vacancies"
          :key="idx"
          :vacancy="item"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import VacancyCard from "./VacancyCard.vue";

defineProps({
  title: {
    type: String,
    default: "Рекомендованные вакансии",
  },
  vacancies: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.vacancy-strip {
  width: 100%;
  margin-top: 24px;
}

.vacancy-strip__title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 14px 0;
}

.vacancy-strip__scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.vacancy-strip__scroll::-webkit-scrollbar {
  height: 6px;
}

.vacancy-strip__scroll::-webkit-scrollbar-track {
  background: #eef2f7;
  border-radius: 3px;
}

.vacancy-strip__scroll::-webkit-scrollbar-thumb {
  background: #b8c5d6;
  border-radius: 3px;
}

.vacancy-strip__scroll::-webkit-scrollbar-thumb:hover {
  background: #9aa8bc;
}

.vacancy-strip__list {
  display: flex;
  gap: 16px;
  width: max-content;
}
</style>
