<template>
  <section class="module-page">
    <div class="page-header">
      <el-text size="large" tag="b">Мониторинг рынка</el-text>
    </div>

    <el-row :gutter="16" class="kpi-row">
      <el-col :xs="24" :md="8" v-for="metric in metrics" :key="metric.label">
        <el-card shadow="never" class="kpi-card">
          <div class="kpi-card__label">{{ metric.label }}</div>
          <div class="kpi-card__value">{{ metric.value }}</div>
          <el-progress :percentage="metric.progress" :stroke-width="8" :show-text="false" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>Оперативные сигналы</span>
          <el-button size="small" text type="primary">Экспорт отчета</el-button>
        </div>
      </template>
      <el-table :data="signals">
        <el-table-column prop="segment" label="Сегмент" min-width="180" />
        <el-table-column prop="change" label="Изменение" width="160" />
        <el-table-column prop="region" label="Регион" width="150" />
        <el-table-column label="Приоритет" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="priorityType[row.priority]">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
const metrics = [
  { label: "Активных вакансий", value: "14 230", progress: 78 },
  { label: "Средний оффер", value: "156 000 ₽", progress: 64 },
  { label: "Скорость закрытия", value: "21 день", progress: 71 },
];

const signals = [
  { segment: "Middle-аналитик данных", change: "+11% за неделю", region: "Москва", priority: "Высокий" },
  { segment: "BI-инженер", change: "-4% за неделю", region: "Санкт-Петербург", priority: "Средний" },
  { segment: "Продуктовый аналитик", change: "+7% за неделю", region: "Казань", priority: "Низкий" },
];

const priorityType = {
  Высокий: "danger",
  Средний: "warning",
  Низкий: "success",
};
</script>

<style scoped>
.module-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-row {
  margin-bottom: 18px;
}

.kpi-card {
  border-radius: 12px;
  border-color: #dfe7f4;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.kpi-card__label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.kpi-card__value {
  margin: 6px 0 12px;
  font-size: 22px;
  font-weight: 700;
  color: #2f4a77;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}
</style>
