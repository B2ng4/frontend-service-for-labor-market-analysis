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
              <el-link v-if="profile.vkUrl" :href="profile.vkUrl" target="_blank" type="primary">
                {{ profile.vkUrl }}
              </el-link>
              <span v-else>—</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="vacancies-card">
      <template #header>
        <span>Рекомендованные вакансии</span>
      </template>
      <el-table :data="mockVacancies" @row-click="openVacancyModal">
        <el-table-column prop="title" label="Должность" />
        <el-table-column prop="company" label="Компания" width="180" />
        <el-table-column label="Совпадение" width="120" align="right">
          <template #default="{ row }">
            <el-tag :type="row.match >= 90 ? 'success' : row.match >= 80 ? 'warning' : 'info'" size="small">
              {{ row.match }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salary" label="Зарплата" width="180" align="right" />
      </el-table>
    </el-card>

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
import { User } from "@element-plus/icons-vue";

const profile = ref({
  fio: "Иванов Иван Иванович",
  login: "ivanov",
  vkUrl: "https://vk.com/example",
});

const mockVacancies = ref([
  { title: "Data Analyst", company: "FinTech Corp", salary: "от 180 000 ₽", match: 95, tags: ["SQL", "Python", "Tableau"], url: "https://hh.ru/vacancy/123456" },
  { title: "Бизнес-аналитик", company: "Retail Group", salary: "150 000 – 200 000 ₽", match: 88, tags: ["Excel", "BI", "Power BI"], url: "https://hh.ru/vacancy/123457" },
  { title: "Аналитик данных", company: "HRTech", salary: "от 170 000 ₽", match: 82, tags: ["SQL", "Python", "ETL"], url: "https://hh.ru/vacancy/123458" },
  { title: "Junior Data Scientist", company: "IT Startup", salary: "120 000 – 150 000 ₽", match: 78, tags: ["Python", "ML", "Pandas"], url: "https://hh.ru/vacancy/123459" },
  { title: "BI-разработчик", company: "Банк", salary: "от 200 000 ₽", match: 75, tags: ["Power BI", "SQL", "DAX"], url: "https://hh.ru/vacancy/123460" },
]);

const modalVisible = ref(false);
const selectedVacancy = ref(null);

const openVacancyModal = (vacancy) => {
  selectedVacancy.value = vacancy;
  modalVisible.value = true;
};
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

.vacancies-card :deep(.el-table) {
  cursor: pointer;
}

.vacancies-card :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
}

.dialog-link {
  text-decoration: none;
}
</style>
