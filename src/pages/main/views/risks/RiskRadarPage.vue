<template>
  <section class="module-page">
    <div class="page-header">
      <el-text size="large" tag="b">Радар рисков</el-text>
    </div>
    <el-alert v-if="error" type="warning" :title="error" show-icon class="module-alert" />

    <el-row :gutter="16" class="risk-stats">
      <el-col :xs="24" :md="6" v-for="item in stats" :key="item.label">
        <el-card shadow="never" class="risk-stat">
          <div class="risk-stat__label">{{ item.label }}</div>
          <div class="risk-stat__value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">Реестр рисков найма</div>
      </template>
      <el-table :data="risks">
        <el-table-column prop="risk" label="Риск" min-width="240" />
        <el-table-column prop="impact" label="Влияние" width="150" />
        <el-table-column prop="probability" label="Вероятность" width="150" />
        <el-table-column prop="action" label="Контроль" min-width="220" />
        <el-table-column label="Уровень" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="levelType[row.level]">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getByGrade, getByRegion, getStats, getTrends } from "@app/api/analytics";

const loading = ref(false);
const error = ref("");
const payload = ref({
  grades: [],
  regions: [],
  stats: null,
  trends: [],
});

const trendVolatility = computed(() => {
  const points = (payload.value.trends || []).map((x) => Number(x.count || 0));
  if (points.length < 3) return 0;
  const avg = points.reduce((a, b) => a + b, 0) / points.length;
  const variance = points.reduce((acc, x) => acc + (x - avg) ** 2, 0) / points.length;
  return Math.round(Math.sqrt(variance));
});

const criticalCount = computed(() => (payload.value.grades || []).filter((g) => Number(g.count || 0) > 1000).length);
const escalationCount = computed(() => (payload.value.regions || []).filter((r) => Number(r.count || 0) < 100).length);

const stats = computed(() => [
  { label: "Критичных рисков", value: criticalCount.value },
  { label: "Под контролем", value: Math.max(0, 8 - criticalCount.value) },
  { label: "Требуют эскалации", value: escalationCount.value },
  { label: "Волатильность спроса", value: trendVolatility.value ? `${trendVolatility.value} вакансий` : "—" },
]);

const risks = computed(() => {
  const gradeTop = payload.value.grades[0];
  const weakRegion = payload.value.regions[payload.value.regions.length - 1];
  return [
    {
      risk: `Перегрев в сегменте ${gradeTop?.grade || "Senior"}`,
      impact: "Высокое",
      probability: criticalCount.value > 0 ? "Высокая" : "Средняя",
      action: "Сократить time-to-offer и ускорить принятие решения",
      level: criticalCount.value > 0 ? "Высокий" : "Средний",
    },
    {
      risk: "Колебание потока вакансий по неделям",
      impact: trendVolatility.value > 150 ? "Высокое" : "Среднее",
      probability: trendVolatility.value > 150 ? "Высокая" : "Средняя",
      action: "Переоценка рекрутинговых квот каждые 2 недели",
      level: trendVolatility.value > 200 ? "Высокий" : "Средний",
    },
    {
      risk: `Слабая воронка в регионе ${weakRegion?.region || "с малым спросом"}`,
      impact: "Среднее",
      probability: weakRegion ? "Средняя" : "Низкая",
      action: "Добавить удаленный найм и расширить географию поиска",
      level: weakRegion ? "Средний" : "Низкий",
    },
  ];
});

const levelType = {
  Высокий: "danger",
  Средний: "warning",
  Низкий: "success",
};

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const [grades, regions, statsData, trends] = await Promise.all([
      getByGrade({ limit: 10 }),
      getByRegion({ limit: 10 }),
      getStats({}),
      getTrends({ days: 60 }),
    ]);
    payload.value = { grades, regions, stats: statsData, trends };
  } catch (err) {
    error.value = err.message || "Не удалось построить радар рисков";
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
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

.risk-stats {
  margin-bottom: 18px;
}

.module-alert {
  margin-bottom: 12px;
}

.risk-stat {
  border-radius: 12px;
  border-color: #e7edf7;
}

.risk-stat__label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.risk-stat__value {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
  color: #29456f;
}

.card-header {
  font-weight: 600;
}
</style>
