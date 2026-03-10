<template>
  <section class="resume-page">
    <div class="page-header">
      <el-text size="large" tag="b">Анализ резюме</el-text>
    </div>

    <div v-if="status === 'idle' || status === 'loading'" class="upload-section" :key="status">
      <el-card shadow="never" class="upload-card">
        <el-result v-if="status === 'loading'" title="Анализируем резюме..." sub-title="Подождите, это может занять несколько секунд">
          <template #icon>
            <el-icon class="loading-icon"><Loading /></el-icon>
          </template>
        </el-result>
        <template v-else>
          <el-upload
            ref="uploadRef"
            drag
            accept=".pdf"
            :limit="1"
            :auto-upload="false"
            :on-change="onFileChange"
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <el-text class="upload-text">Перетащите PDF сюда или <em>выберите файл</em></el-text>
            <el-text size="small" type="info">Только PDF, до 10 МБ</el-text>
          </el-upload>
          <el-button v-if="file" type="primary" size="large" :loading="loading" @click="analyzeResume">Анализировать</el-button>
        </template>
      </el-card>
    </div>

    <div v-else-if="report" class="report-section" key="report">
      <el-card shadow="never" class="report-card">
        <template #header>
          <div class="report-card-header">
            <div class="status-row">
              <el-tag type="success">Готово</el-tag>
              <el-button text size="small" @click="reset">Загрузить другое</el-button>
            </div>
          </div>
        </template>

        <el-row :gutter="32">
          <el-col :xs="24" :md="8">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Оценка">
                <el-tag type="primary" size="large">{{ report.score }} / 100</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <el-text tag="b" size="default">Выявленные навыки</el-text>
            <div class="skills-row">
              <el-tag v-for="skill in report.skills" :key="skill" size="small" type="info">{{ skill }}</el-tag>
            </div>
          </el-col>
          <el-col :xs="24" :md="16">
            <el-text tag="b">Краткое резюме</el-text>
            <p class="report-summary">{{ report.summary }}</p>
            <el-text tag="b">Опыт</el-text>
            <p class="report-summary">{{ report.experience }}</p>
            <el-text tag="b">Рекомендации</el-text>
            <ul class="report-list">
              <li v-for="(rec, i) in report.recommendations" :key="i">{{ rec }}</li>
            </ul>
          </el-col>
        </el-row>

        <el-divider />

        <div class="vacancies-header">
          <el-text tag="b" size="default">Подходящие вакансии</el-text>
          <el-button size="small" @click="exportRecommendations">Скачать</el-button>
        </div>
        <el-table :data="(report?.vacancies ?? [])" style="margin-top: 16px" @row-click="openRow">
          <el-table-column prop="title" label="Должность" />
          <el-table-column label="Источник" width="100">
            <template #default="{ row }">
              <el-tag :type="sourceTypes[row.source]" size="small">{{ sourceLabels[row.source] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="company" label="Компания" width="160" />
          <el-table-column label="Совпадение" width="110" align="right">
            <template #default="{ row }">
              <el-tag type="success" size="small">{{ row.match }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salary" label="Зарплата" width="160" align="right" />
        </el-table>
      </el-card>
    </div>

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
import { ElMessage } from "element-plus";
import { Upload, Loading } from "@element-plus/icons-vue";
import { SOURCE_LABELS, SOURCE_TYPES } from "@app/utils/vacancy";
import { useAppStore } from "@app/store/useAppStore";
import VacancyModal from "@app/components/VacancyModal.vue";

const router = useRouter();
const store = useAppStore();

const uploadRef = ref(null);
const file = ref(null);
const loading = ref(false);
const modalVisible = ref(false);
const selectedVacancy = ref(null);

const status = computed(() => store.resumeStatus?.value ?? store.resumeStatus ?? "idle");
const report = computed(() => store.resumeReport?.value ?? store.resumeReport ?? null);

const missingSkills = computed(() => (selectedVacancy.value ? store.getMissingSkills(selectedVacancy.value.tags) : []));
const matchedSkills = computed(() => (selectedVacancy.value ? store.getMatchedSkills(selectedVacancy.value.tags) : []));

const sourceLabels = SOURCE_LABELS;
const sourceTypes = SOURCE_TYPES;

const mockVacanciesWithSource = [
  { id: "1", title: "Data Analyst", company: "FinTech Corp", salary: "от 180 000 ₽", match: 95, tags: ["SQL", "Python", "Tableau"], source: "hh", url: "https://hh.ru/vacancy/123456" },
  { id: "2", title: "Бизнес-аналитик", company: "Retail Group", salary: "150 000 – 200 000 ₽", match: 88, tags: ["Excel", "BI", "Power BI"], source: "hh", url: "https://hh.ru/vacancy/123457" },
  { id: "3", title: "Аналитик данных", company: "HRTech", salary: "от 170 000 ₽", match: 82, tags: ["SQL", "Python", "ETL"], source: "superjob", url: "https://hh.ru/vacancy/123458" },
];

const onFileChange = (uploadFile) => {
  if (uploadFile.raw?.type === "application/pdf") {
    file.value = uploadFile.raw;
  } else {
    file.value = null;
    uploadRef.value?.clearFiles?.();
    if (uploadFile.raw) ElMessage.warning("Загрузите файл в формате PDF");
  }
};

const mockReport = () => ({
  score: 78,
  summary: "Резюме соответствует уровню Middle Data Analyst. Выделяются сильные навыки в SQL и Python.",
  skills: ["SQL", "Python", "Tableau", "Excel", "Power BI", "ETL"],
  experience: "Около 3 лет в аналитике. Опыт дашбордов, отчётов, работы с данными.",
  recommendations: ["Добавьте количественные метрики к проектам", "Укажите конкретные инструменты визуализации", "Расширьте раздел технических навыков"],
  vacancies: mockVacanciesWithSource,
});

const analyzeResume = async () => {
  if (!file.value) return;
  loading.value = true;
  store.setResumeStatus("loading");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  store.setResumeReport(mockReport());
  loading.value = false;
};

const reset = () => {
  file.value = null;
  store.setResumeReport(null);
  store.setResumeStatus("idle");
  uploadRef.value?.clearFiles?.();
};

const openRow = (row) => {
  selectedVacancy.value = row;
  store.addViewed(row);
  modalVisible.value = true;
};

const openCompare = (v) => {
  router.push({ path: "/main/compare", query: { id: v.id } });
};

const exportRecommendations = () => {
  const list = report.value?.vacancies || [];
  const text = list.map((v) => `${v.title} | ${v.company} | ${v.salary}`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recommendations.txt";
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.resume-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.upload-section {
  margin-top: 24px;
}

.upload-card {
  padding: 48px 24px;
  text-align: center;
}

.upload-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-card :deep(.el-upload-dragger) {
  width: 100%;
  max-width: 480px;
  padding: 40px 24px;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 12px;
}

.upload-text {
  display: block;
  margin-bottom: 8px;
}

.report-card-header {
  margin-bottom: 0;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-summary {
  margin: 8px 0 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.report-list {
  margin: 8px 0 0;
  padding-left: 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.vacancies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-card :deep(.el-table) {
  cursor: pointer;
}

.report-card :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}
</style>
