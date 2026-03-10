<template>
  <section class="favorites-page">
    <div class="page-header">
      <el-text size="large" tag="b">Избранное</el-text>
      <el-button v-if="favoritesList.length" size="small" @click="exportFavorites">Скачать (TXT)</el-button>
    </div>

    <el-card shadow="never">
      <el-empty v-if="!favoritesList.length" description="Нет избранных вакансий" />
      <el-table v-else :data="favoritesList" @row-click="openVacancy">
        <el-table-column label="Должность" min-width="160">
          <template #default="{ row }">
            <div class="cell-title">
              <el-tag :type="sourceTypes[row.source]" size="small" class="source-badge">{{ sourceLabels[row.source] }}</el-tag>
              {{ row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="Компания" width="160" />
        <el-table-column prop="region" label="Регион" width="130" />
        <el-table-column label="Совпадение" width="110" align="right">
          <template #default="{ row }">
            <el-tag :type="row.match >= 90 ? 'success' : row.match >= 80 ? 'warning' : 'info'" size="small">{{ row.match }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salary" label="Зарплата" width="160" align="right" />
        <el-table-column label="" width="80" align="center">
          <template #default="{ row }">
            <el-button :icon="StarFilled" link type="warning" @click.stop="store.toggleFavorite(row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <vacancy-modal
      v-model="modalVisible"
      :vacancy="selectedVacancy"
      :missing-skills="missingSkills"
      :matched-skills="matchedSkills"
      @compare="openCompare"
    />
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { StarFilled } from "@element-plus/icons-vue";
import { SOURCE_LABELS, SOURCE_TYPES } from "@app/utils/vacancy";
import { useAppStore } from "@app/store/useAppStore";
import VacancyModal from "@app/components/VacancyModal.vue";

const router = useRouter();
const store = useAppStore();

const modalVisible = ref(false);
const selectedVacancy = ref(null);

const sourceLabels = SOURCE_LABELS;
const sourceTypes = SOURCE_TYPES;

const favoritesList = computed(() => store.favoriteVacancies?.value ?? []);

const missingSkills = computed(() => (selectedVacancy.value ? store.getMissingSkills(selectedVacancy.value.tags) : []));
const matchedSkills = computed(() => (selectedVacancy.value ? store.getMatchedSkills(selectedVacancy.value.tags) : []));

const openVacancy = (row) => {
  selectedVacancy.value = row;
  store.addViewed(row);
  modalVisible.value = true;
};

const openCompare = (v) => {
  router.push({ path: "/main/compare", query: { id: v.id } });
};

const exportFavorites = () => {
  const text = favoritesList.value.map((v) => `${v.title} | ${v.company} | ${v.salary}`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "favorites.txt";
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.favorites-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.cell-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.source-badge {
  flex-shrink: 0;
}

:deep(.el-table) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}
</style>
