<template>
  <section class="vacancies-page">
    <div class="page-header">
      <el-text size="large" tag="b">Поиск вакансий</el-text>
    </div>

    <div class="filters-panel">
      <div class="filters-search">
        <el-input
          v-model="filters.query"
          placeholder="Должность, компания..."
          clearable
          size="large"
          class="search-input"
          @change="loadVacancies"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="filters-row">
        <div class="filter-group">
          <span class="filter-label">Источник</span>
          <div class="filter-chips">
            <button
              v-for="opt in sourceOptions"
              :key="opt.value"
              type="button"
              class="filter-chip"
              :class="{ 'filter-chip--active': filters.source === opt.value }"
              @click="filters.source = filters.source === opt.value ? '' : opt.value; loadVacancies()"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">Регион</span>
          <el-select v-model="filters.region" placeholder="Любой" clearable size="default" class="filter-select" @change="loadVacancies">
            <el-option label="Москва" value="Москва" />
            <el-option label="Санкт-Петербург" value="Санкт-Петербург" />
          </el-select>
        </div>
        <div class="filter-group">
          <span class="filter-label">Зарплата от, ₽</span>
          <el-input-number
            v-model="filters.salaryMin"
            :min="0"
            :step="10000"
            :controls="false"
            placeholder="0"
            class="filter-salary"
            @change="loadVacancies"
          />
        </div>
        <div class="filter-group filter-group--skills">
          <span class="filter-label">Навыки</span>
          <el-select
            v-model="filters.skills"
            multiple
            placeholder="Выберите"
            collapse-tags
            collapse-tags-tooltip
            size="default"
            class="filter-select"
          >
            <el-option label="SQL" value="SQL" />
            <el-option label="Python" value="Python" />
            <el-option label="Excel" value="Excel" />
            <el-option label="Power BI" value="Power BI" />
            <el-option label="Tableau" value="Tableau" />
          </el-select>
        </div>
        <el-button text type="primary" class="filter-reset" @click="resetFilters">Сбросить</el-button>
      </div>
    </div>

    <el-card shadow="never" class="results-card">
      <template #header>
        <div class="results-header">
          <span>Найдено: {{ filteredVacancies.length }}</span>
          <el-button v-if="filteredVacancies.length" size="small" @click="exportRecommendations">Скачать</el-button>
        </div>
      </template>
      <el-skeleton v-if="loading && !apiVacancies.length" class="table-skeleton" :rows="6" animated />
      <el-table
        v-else
        v-loading="loading"
        :data="filteredVacancies"
        @row-click="openVacancy"
      >
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
        <el-table-column label="" width="60" align="center">
          <template #default="{ row }">
            <el-button
              :icon="store.isFavorite(row.id) ? StarFilled : Star"
              link
              :type="store.isFavorite(row.id) ? 'warning' : undefined"
              @click.stop="toggleFavorite(row.id)"
            />
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Star, StarFilled, Search } from "@element-plus/icons-vue";
import { SOURCE_LABELS, SOURCE_TYPES, mapSearchVacancy } from "@app/utils/vacancy";
import { useAppStore } from "@app/store/useAppStore";
import { searchVacancies } from "@app/api/analytics";
import VacancyModal from "@app/components/VacancyModal.vue";

const router = useRouter();
const store = useAppStore();

const filters = reactive({
  query: "",
  source: "",
  region: "",
  salaryMin: null,
  skills: [],
});

const modalVisible = ref(false);
const selectedVacancy = ref(null);

const sourceLabels = SOURCE_LABELS;
const sourceTypes = SOURCE_TYPES;

const sourceOptions = [
  { label: "HH.ru", value: "hh" },
  { label: "Авито", value: "avito" },
  { label: "SuperJob", value: "superjob" },
];

const loading = ref(false);
const apiVacancies = ref([]);

const filteredVacancies = computed(() => {
  let list = [...apiVacancies.value];
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter((v) => v.title?.toLowerCase().includes(q) || v.company?.toLowerCase().includes(q));
  }
  if (filters.source) list = list.filter((v) => v.source === filters.source);
  if (filters.region) list = list.filter((v) => v.region === filters.region);
  if (filters.salaryMin) list = list.filter((v) => (v.salaryMin || 0) >= filters.salaryMin);
  if (filters.skills?.length) {
    list = list.filter((v) => filters.skills.some((s) => (v.tags || []).includes(s)));
  }
  return list;
});

const missingSkills = computed(() => (selectedVacancy.value ? store.getMissingSkills(selectedVacancy.value.tags) : []));
const matchedSkills = computed(() => (selectedVacancy.value ? store.getMatchedSkills(selectedVacancy.value.tags) : []));


const resetFilters = () => {
  filters.query = "";
  filters.source = "";
  filters.region = "";
  filters.salaryMin = null;
  filters.skills = [];
  loadVacancies();
};

const openVacancy = (row) => {
  selectedVacancy.value = row;
  store.addViewed(row);
  modalVisible.value = true;
};

const openCompare = (v) => {
  router.push({ path: "/main/compare", query: { id: v.id } });
};

const toggleFavorite = (id) => {
  const added = store.toggleFavorite(id);
  ElMessage.success(added ? "Вакансия добавлена в избранное" : "Вакансия удалена из избранного");
};

const exportRecommendations = () => {
  const text = filteredVacancies.value.map((v) => `${v.title} | ${v.company} | ${v.salary}`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recommendations.txt";
  a.click();
  URL.revokeObjectURL(url);
};

const loadVacancies = async () => {
  loading.value = true;
  try {
    const response = await searchVacancies({
      q: filters.query || undefined,
      source: filters.source || undefined,
      city: filters.region || undefined,
      salary_from_min: filters.salaryMin || undefined,
      limit: 100,
      offset: 0,
    });
    apiVacancies.value = (response.items || []).map((item, index) => mapSearchVacancy(item, index));
  } catch (error) {
    ElMessage.error(error.message || "Не удалось загрузить вакансии");
  } finally {
    loading.value = false;
  }
};

onMounted(loadVacancies);
</script>

<style scoped>
.vacancies-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.filters-panel {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
}

.filters-search {
  margin-bottom: 20px;
}

.search-input {
  max-width: 520px;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group--skills {
  min-width: 180px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}

.filter-chip--active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-color: var(--el-color-primary-light-5);
}

.filter-select {
  width: 160px;
}

.filter-salary {
  width: 120px;
}

.filter-salary :deep(.el-input__inner) {
  text-align: left;
}

.filter-reset {
  margin-left: auto;
  flex-shrink: 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-skeleton {
  padding: 8px 0;
}

.cell-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.source-badge {
  flex-shrink: 0;
}

.results-card :deep(.el-table) {
  cursor: pointer;
}

.results-card :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}
</style>

