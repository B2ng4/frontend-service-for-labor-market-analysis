<template>
  <section class="resume-page">
    <div class="page-header">
      <el-text size="large" tag="b">Анализ резюме</el-text>
    </div>

    <div v-if="!report" class="upload-section">
      <el-card shadow="never" class="upload-card">
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
        <el-button
          v-if="file"
          type="primary"
          size="large"
          :loading="loading"
          @click="analyzeResume"
        >
          Анализировать
        </el-button>
      </el-card>
    </div>

    <div v-else class="report-section">
      <el-card shadow="never" class="report-card">
        <template #header>
          <div class="report-card-header">
            <span>Отчёт по резюме</span>
            <el-button text size="small" @click="reset">Загрузить другое</el-button>
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
              <el-tag v-for="skill in report.skills" :key="skill" size="small" type="info">
                {{ skill }}
              </el-tag>
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

        <el-text tag="b" size="default">Подходящие вакансии</el-text>
        <el-table :data="report.vacancies" style="margin-top: 16px" @row-click="(row) => openVacancyModal(row)">
          <el-table-column prop="title" label="Должность" />
          <el-table-column prop="company" label="Компания" width="160" />
          <el-table-column prop="match" label="Совпадение" width="120" align="right">
            <template #default="{ row }">
              <el-tag type="success" size="small">{{ row.match }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="salary" label="Зарплата" width="160" align="right" />
        </el-table>
      </el-card>
    </div>

    <el-dialog v-model="modalVisible" :title="selectedVacancy?.title ?? 'Вакансия'" width="400px">
      <div v-if="selectedVacancy">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Компания">{{ selectedVacancy.company }}</el-descriptions-item>
          <el-descriptions-item label="Зарплата">{{ selectedVacancy.salary }}</el-descriptions-item>
          <el-descriptions-item label="Совпадение">{{ selectedVacancy.match }}%</el-descriptions-item>
          <el-descriptions-item label="Навыки">
            <el-tag v-for="tag in selectedVacancy.tags" :key="tag" size="small" style="margin-right: 4px">
              {{ tag }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <a v-if="selectedVacancy" :href="selectedVacancy.url" target="_blank" rel="noopener noreferrer" class="dialog-link">
          <el-button type="primary">Открыть вакансию</el-button>
        </a>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Upload } from "@element-plus/icons-vue";

const uploadRef = ref(null);
const file = ref(null);
const loading = ref(false);
const report = ref(null);
const modalVisible = ref(false);
const selectedVacancy = ref(null);

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
  recommendations: [
    "Добавьте количественные метрики к проектам",
    "Укажите конкретные инструменты визуализации",
    "Расширьте раздел технических навыков",
  ],
  vacancies: [
    { title: "Data Analyst", company: "FinTech Corp", salary: "от 180 000 ₽", match: 95, tags: ["SQL", "Python", "Tableau"], url: "https://hh.ru/vacancy/123456" },
    { title: "Бизнес-аналитик", company: "Retail Group", salary: "150 000 – 200 000 ₽", match: 88, tags: ["Excel", "BI", "Power BI"], url: "https://hh.ru/vacancy/123457" },
    { title: "Аналитик данных", company: "HRTech", salary: "от 170 000 ₽", match: 82, tags: ["SQL", "Python", "ETL"], url: "https://hh.ru/vacancy/123458" },
  ],
});

const analyzeResume = async () => {
  if (!file.value) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 2000));
  report.value = mockReport();
  loading.value = false;
};

const reset = () => {
  file.value = null;
  report.value = null;
  uploadRef.value?.clearFiles?.();
};

const openVacancyModal = (vacancy) => {
  selectedVacancy.value = vacancy;
  modalVisible.value = true;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.report-card :deep(.el-table) {
  cursor: pointer;
}

.report-card :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}

.dialog-link {
  text-decoration: none;
}
</style>
