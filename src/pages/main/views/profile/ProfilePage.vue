<template>
  <section class="profile-page">
    <div class="page-header">
      <el-text size="large" tag="b">Профиль</el-text>
    </div>

    <el-card shadow="never">
      <el-row :gutter="32">
        <el-col :xs="24" :md="8">
          <div class="avatar-wrap">
            <el-avatar :size="96">
              <el-icon :size="48"><User /></el-icon>
            </el-avatar>
          </div>
        </el-col>
        <el-col :xs="24" :md="16">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="ФИО">{{ profile.fio || '—' }}</el-descriptions-item>
            <el-descriptions-item label="Логин">{{ profile.login || '—' }}</el-descriptions-item>
            <el-descriptions-item label="ВКонтакте">
              <el-link v-if="profile.vkId" :href="`https://vk.com/id${profile.vkId}`" target="_blank" type="primary">
                {{ `https://vk.com/id${profile.vkId}` }}
              </el-link>
              <span v-else>—</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="vacancies-card">
      <template #header>
        <div class="vacancies-header">
          <span>Рекомендованные вакансии</span>
          <el-button v-if="vacanciesList.length" size="small" @click="exportRecs">Скачать</el-button>
        </div>
      </template>
      <el-skeleton v-if="loading && !vacanciesList.length" class="table-skeleton" :rows="5" animated />
      <el-table
        v-else
        v-loading="loading"
        :data="vacanciesList"
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
        <el-table-column prop="company" label="Компания" width="180" />
        <el-table-column prop="region" label="Регион" width="120" />
        <el-table-column label="Совпадение" width="120" align="right">
          <template #default="{ row }">
            <el-tag :type="row.match >= 90 ? 'success' : row.match >= 80 ? 'warning' : 'info'" size="small">
              {{ row.match }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salary" label="Зарплата" width="180" align="right" />
        <el-table-column label="" width="60" align="center">
          <template #default="{ row }">
            <el-button :icon="store.isFavorite(row.id) ? StarFilled : Star" link :type="store.isFavorite(row.id) ? 'warning' : undefined" @click.stop="toggleFavorite(row.id)" />
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Star, StarFilled } from "@element-plus/icons-vue";
import { SOURCE_LABELS, SOURCE_TYPES, mapRecommendationVacancy } from "@app/utils/vacancy";
import { useAppStore } from "@app/store/useAppStore";
import { useSessionStore } from "@app/store/useSessionStore";
import { getRecommendations } from "@app/api/analytics";
import VacancyModal from "@app/components/VacancyModal.vue";

const router = useRouter();
const store = useAppStore();
const session = useSessionStore();
const loading = ref(false);

const profile = computed(() => {
  const user = session.state.user || {};
  return {
    fio: user.full_name || "—",
    login: user.email || "—",
    vkId: user.vk_id || null,
  };
});

const modalVisible = ref(false);
const selectedVacancy = ref(null);

const sourceLabels = SOURCE_LABELS;
const sourceTypes = SOURCE_TYPES;

const vacanciesList = computed(() => {
  const v = store.vacancies?.value ?? store.vacancies ?? [];
  return Array.isArray(v) ? v : [];
});

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

const toggleFavorite = (id) => {
  const added = store.toggleFavorite(id);
  ElMessage.success(added ? "Вакансия добавлена в избранное" : "Вакансия удалена из избранного");
};

const exportRecs = () => {
  const text = vacanciesList.value.map((v) => `${v.title} | ${v.company} | ${v.salary}`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recommendations.txt";
  a.click();
  URL.revokeObjectURL(url);
};

onMounted(async () => {
  if (!session.state.token) return;
  loading.value = true;
  try {
    const data = await getRecommendations(session.state.token, { source: "resume", limit: 20 });
    store.vacancies.value = (data.vacancies || []).map((item, index) => mapRecommendationVacancy(item, index));
  } catch (error) {
    ElMessage.warning(error.message || "Не удалось получить рекомендации по резюме");
    try {
      const fallback = await getRecommendations(session.state.token, { source: "vk", limit: 20 });
      store.vacancies.value = (fallback.vacancies || []).map((item, index) => mapRecommendationVacancy(item, index));
    } catch (_err) {}
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.vacancies-card {
  margin-top: 24px;
}

.table-skeleton {
  padding: 8px 0;
}

.vacancies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cell-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.source-badge {
  flex-shrink: 0;
}

.vacancies-card :deep(.el-table) {
  cursor: pointer;
}

.vacancies-card :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}
</style>

