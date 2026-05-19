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

    <el-alert v-if="error" type="warning" :title="error" show-icon class="module-alert" />
    <el-skeleton v-if="loading" :rows="4" animated />

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>Оперативные сигналы</span>
          <el-button size="small" text type="primary" :disabled="!signals.length" @click="exportSignals">
            Экспорт отчета
          </el-button>
        </div>
      </template>
      <el-empty v-if="!loading && !signals.length" description="Нет данных для сигналов" />
      <el-table v-else :data="signals">
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
import { computed, onMounted, ref } from "vue";
import { getStats, getSalaryStats, getTrends, getByRegion, getByDomain } from "@app/api/analytics";

const loading = ref(false);
const error = ref("");
const payload = ref({
  stats: null,
  salary: [],
  trends: [],
  regions: [],
  domains: [],
});

const avgOffer = computed(() => {
  const rows = payload.value.salary || [];
  if (!rows.length) return 0;
  const values = rows.map((r) => Number(r.avg_salary || 0)).filter((v) => v > 0);
  if (!values.length) return 0;
  return Math.round(values.reduce((acc, n) => acc + n, 0) / values.length);
});

const trendDelta = computed(() => {
  const rows = payload.value.trends || [];
  if (rows.length < 2) return 0;
  const firstHalf = rows.slice(0, Math.floor(rows.length / 2)).reduce((acc, row) => acc + Number(row.count || 0), 0);
  const secondHalf = rows.slice(Math.floor(rows.length / 2)).reduce((acc, row) => acc + Number(row.count || 0), 0);
  if (!firstHalf) return 0;
  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
});

const metrics = computed(() => [
  {
    label: "Активных вакансий",
    value: Number(payload.value.stats?.total_vacancies || 0).toLocaleString("ru-RU"),
    progress: Math.min(100, Math.round((Number(payload.value.stats?.total_vacancies || 0) / 20000) * 100)),
  },
  {
    label: "Средний оффер",
    value: avgOffer.value ? `${avgOffer.value.toLocaleString("ru-RU")} ₽` : "—",
    progress: avgOffer.value ? Math.min(100, Math.round((avgOffer.value / 250000) * 100)) : 0,
  },
  {
    label: "Динамика спроса",
    value: `${trendDelta.value > 0 ? "+" : ""}${trendDelta.value}%`,
    progress: Math.max(0, Math.min(100, 50 + trendDelta.value)),
  },
]);

const signals = computed(() => {
  const topDomains = (payload.value.domains || []).slice(0, 3);
  const topRegions = (payload.value.regions || []).slice(0, 3);
  return topDomains.map((domain, idx) => {
    const region = topRegions[idx]?.region || "Не указано";
    const change = trendDelta.value >= 0 ? `+${trendDelta.value}% за период` : `${trendDelta.value}% за период`;
    const priority = domain.count > 1000 ? "Высокий" : domain.count > 400 ? "Средний" : "Низкий";
    return {
      segment: domain.domain || "Не указано",
      change,
      region,
      priority,
    };
  });
});

const priorityType = {
  Высокий: "danger",
  Средний: "warning",
  Низкий: "success",
};

const exportSignals = () => {
  const text = signals.value.map((s) => `${s.segment} | ${s.change} | ${s.region} | ${s.priority}`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "market-signals.txt";
  link.click();
  URL.revokeObjectURL(url);
};

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const [stats, salary, trends, regions, domains] = await Promise.all([
      getStats({}),
      getSalaryStats({ group_by: "domain", limit: 10 }),
      getTrends({ days: 90 }),
      getByRegion({ limit: 10 }),
      getByDomain({ limit: 10 }),
    ]);
    payload.value = { stats, salary, trends, regions, domains };
  } catch (err) {
    error.value = err.message || "Не удалось загрузить рыночные показатели";
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

.kpi-row {
  margin-bottom: 18px;
}

.module-alert {
  margin-bottom: 12px;
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
