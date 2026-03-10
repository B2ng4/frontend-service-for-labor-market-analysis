<template>
  <section class="compare-page">
    <div class="page-header">
      <el-text size="large" tag="b">Сравнение: резюме и вакансия</el-text>
      <el-button text @click="$router.back()">← Назад</el-button>
    </div>

    <el-row :gutter="24" v-if="vacancy">
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="compare-card">
          <template #header>
            <span>Ваше резюме</span>
          </template>
          <div class="skill-block">
            <el-text tag="b" size="small">Ваши навыки</el-text>
            <div class="skill-tags">
              <el-tag v-for="s in userSkills" :key="s" type="success" size="small">{{ s }}</el-tag>
            </div>
          </div>
          <el-empty v-if="!userSkills?.length" description="Загрузите резюме" :image-size="80" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="compare-card">
          <template #header>
            <span>{{ vacancy.title }}</span>
            <el-tag :type="sourceType" size="small">{{ sourceLabel }}</el-tag>
          </template>
          <div class="skill-block">
            <el-text tag="b" size="small">Требуемые навыки</el-text>
            <div class="skill-tags">
              <el-tag v-for="t in vacancy.tags" :key="t" :type="matchedSet.has(t) ? 'success' : 'info'" size="small">
                {{ t }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="diff-card">
      <template #header>
        <span>Соответствие</span>
      </template>
      <div class="diff-visual">
        <div class="diff-row">
          <span class="diff-label">Есть в резюме</span>
          <div class="diff-bar">
            <div class="diff-fill diff-fill--matched" :style="{ width: matchPercent + '%' }" />
          </div>
          <span class="diff-value">{{ matchedSkills.length }}/{{ totalSkills }}</span>
        </div>
        <div class="diff-row">
          <span class="diff-label">Нужно доучить</span>
          <div class="diff-bar">
            <div class="diff-fill diff-fill--missing" :style="{ width: missingPercent + '%' }" />
          </div>
          <span class="diff-value">{{ missingSkills.length }}</span>
        </div>
      </div>
      <div v-if="missingSkills.length" class="missing-list">
        <el-text tag="b" size="small">Недостающие навыки:</el-text>
        <el-tag v-for="s in missingSkills" :key="s" type="danger" size="small" effect="plain">{{ s }}</el-tag>
      </div>
    </el-card>

    <el-empty v-if="!vacancy" description="Вакансия не найдена" />
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { SOURCE_LABELS, SOURCE_TYPES } from "@app/utils/vacancy";
import { useAppStore } from "@app/store/useAppStore";

const route = useRoute();
const store = useAppStore();

const vacanciesArr = computed(() => store.vacancies?.value ?? store.vacancies ?? []);
const vacancy = computed(() => vacanciesArr.value.find((v) => v.id === route.query.id));

const userSkills = computed(() => {
  const v = store.userSkills;
  return Array.isArray(v) ? v : (v?.value ?? []);
});
const matchedSkills = computed(() => (vacancy.value ? store.getMatchedSkills(vacancy.value.tags) : []));
const missingSkills = computed(() => (vacancy.value ? store.getMissingSkills(vacancy.value.tags) : []));
const totalSkills = computed(() => vacancy.value?.tags?.length || 0);
const matchedSet = computed(() => new Set(matchedSkills.value));

const matchPercent = computed(() => (totalSkills.value ? (matchedSkills.value.length / totalSkills.value) * 100 : 0));
const missingPercent = computed(() => (totalSkills.value ? (missingSkills.value.length / totalSkills.value) * 100 : 0));

const sourceLabel = computed(() => (vacancy.value?.source ? SOURCE_LABELS[vacancy.value.source] : ""));
const sourceType = computed(() => (vacancy.value?.source ? SOURCE_TYPES[vacancy.value.source] : "info"));
</script>

<style scoped>
.compare-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.compare-card :deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-block {
  margin-bottom: 16px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.diff-card {
  margin-top: 24px;
}

.diff-visual {
  padding: 16px 0;
}

.diff-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.diff-label {
  width: 140px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.diff-bar {
  flex: 1;
  height: 24px;
  background: var(--el-border-color-lighter);
  border-radius: 6px;
  overflow: hidden;
}

.diff-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s;
}

.diff-fill--matched {
  background: var(--el-color-success);
}

.diff-fill--missing {
  background: var(--el-color-danger);
}

.diff-value {
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
}

.missing-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
