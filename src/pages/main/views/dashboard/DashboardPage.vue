<template>
  <section class="dashboard-page">
    <dashboard-header />
    <el-alert v-if="dashboardState.error" :title="dashboardState.error" type="warning" show-icon class="dashboard-alert" />
    <el-alert
      v-else-if="dashboardState.loading && !dashboardState.hasLoaded"
      title="Обновляем аналитику по данным бекенда..."
      type="info"
      show-icon
      class="dashboard-alert"
    />
    <el-empty
      v-if="!dashboardState.loading && dashboardState.hasLoaded && isDashboardEmpty"
      description="Недостаточно данных аналитики для отображения графиков"
    />

    <div class="dashboard-panel">
      <GridLayout
        :layout="layout"
        :col-num="12"
        :row-height="120"
        :margin="[14, 14]"
        :is-draggable="true"
        :is-resizable="true"
        :is-bounded="true"
        :vertical-compact="true"
        :use-css-transforms="true"
        :responsive="true"
        :prevent-collision="false"
        :restore-on-drag="true"
        draggable-handle=".drag-handle"
        @layout-updated="onLayoutUpdated"
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          class="grid-item"
        >
          <e-chart-card :chart="chartsById[item.i]" :show-drag-handle="true" />
        </GridItem>
      </GridLayout>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { GridLayout, GridItem } from "vue-grid-layout-v3";
import DashboardHeader from "@pages/main/views/dashboard/components/header/DashboardHeader.vue";
import EChartCard from "@pages/main/views/dashboard/components/charts/EChartCard.vue";
import { useDashboardStore } from "@app/store/useDashboardStore";

const dashboardStore = useDashboardStore();
const dashboardState = dashboardStore.state;
const isDashboardEmpty = computed(() => {
  const p = dashboardState.payload;
  return !p.stats && !p.trends.length && !p.byDomain.length && !p.topSkills.length;
});

const monthLabel = (isoDate) => {
  const d = new Date(isoDate);
  return Number.isNaN(d.getTime()) ? String(isoDate) : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
};

const toCountMap = (rows, keyField) =>
  (rows || []).reduce((acc, row) => {
    acc[String(row[keyField] || "Не указано")] = Number(row.count || 0);
    return acc;
  }, {});

const chartsById = reactive({
  "salary-trend": {
    id: "salary-trend",
    title: "Динамика публикации вакансий",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value", name: "вакансий" },
      series: [{ data: [], type: "line", smooth: true, areaStyle: { opacity: 0.12 } }],
      color: ["#4F7BF7"],
    },
  },
  "vacancy-by-sector": {
    id: "vacancy-by-sector",
    title: "Вакансии по направлениям",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [{ type: "pie", radius: ["42%", "70%"], data: [] }],
      color: ["#4F7BF7", "#36CFC9", "#A98BFF", "#FFB347", "#FF6B72"],
    },
  },
  "top-skills": {
    id: "top-skills",
    title: "Топ навыков",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value", name: "вакансий" },
      series: [{ type: "bar", data: [], barWidth: "55%" }],
      color: ["#4F7BF7"],
    },
  },
  "salary-by-region": {
    id: "salary-by-region",
    title: "Вакансии по регионам",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value" },
      series: [{ type: "bar", data: [], barWidth: "55%" }],
      color: ["#36CFC9"],
    },
  },
  "community-categories": {
    id: "community-categories",
    title: "Источники вакансий",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [{ type: "pie", radius: ["42%", "70%"], data: [] }],
      color: ["#4F7BF7", "#36CFC9", "#A98BFF", "#FFB347", "#FF6B72"],
    },
  },
  "region-comparison": {
    id: "region-comparison",
    title: "Сравнение грейдов",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value" },
      series: [{ type: "bar", data: [], barWidth: "45%" }],
      color: ["#6E9BFF"],
    },
  },
  "competition-index": {
    id: "competition-index",
    title: "Индекс конкуренции",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value", min: 0, max: 10 },
      series: [{ type: "line", smooth: true, symbolSize: 8, data: [] }],
      color: ["#9C6DFF"],
    },
  },
  "vacancy-dynamics": {
    id: "vacancy-dynamics",
    title: "Динамика вакансий и зарплат",
    option: {
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value" },
      series: [
        { name: "Вакансии", type: "line", smooth: true, data: [] },
        { name: "Средняя зарплата", type: "line", smooth: true, data: [] },
      ],
      color: ["#4F7BF7", "#36CFC9"],
    },
  },
  "remote-share": {
    id: "remote-share",
    title: "Матрица домен / грейд",
    option: {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value" },
      series: [],
      color: ["#6E9BFF", "#A98BFF", "#36CFC9"],
    },
  },
  "skills-radar": {
    id: "skills-radar",
    title: "Востребованные навыки",
    option: {
      tooltip: {},
      radar: { radius: "60%", indicator: [] },
      series: [{ type: "radar", data: [] }],
      color: ["#4F7BF7"],
    },
  },
  "kpi-gauge": {
    id: "kpi-gauge",
    title: "Покрытие зарплат",
    option: {
      tooltip: { formatter: "{a}<br/>{b}: {c}%" },
      series: [{ name: "Зарплаты", type: "gauge", progress: { show: true, width: 14 }, axisLine: { lineStyle: { width: 14 } }, detail: { valueAnimation: true, formatter: "{value}%" }, data: [{ value: 0, name: "С указанием" }] }],
      color: ["#5ECF8E"],
    },
  },
  "response-speed": {
    id: "response-speed",
    title: "Тепловая карта доменов и грейдов",
    option: {
      tooltip: { position: "top" },
      grid: { height: "68%", top: "12%" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "category", data: [] },
      visualMap: { min: 0, max: 1, calculable: true, orient: "horizontal", left: "center", bottom: 0 },
      series: [{ type: "heatmap", data: [] }],
    },
  },
  "salary-distribution": {
    id: "salary-distribution",
    title: "Распределение зарплат по доменам",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: [] },
      yAxis: { type: "value", name: "медиана, ₽" },
      series: [{ type: "bar", data: [], barWidth: "55%" }],
      color: ["#FFB347"],
    },
  },
});

const derived = computed(() => {
  const p = dashboardState.payload;
  const trends = p.trends || [];
  const byDomain = p.byDomain || [];
  const topSkills = p.topSkills || [];
  const byRegion = p.byRegion || [];
  const bySource = p.bySource || [];
  const byGrade = p.byGrade || [];
  const salary = p.salaryByDomain || [];
  const matrix = p.domainGradeMatrix || [];

  const trendLabels = trends.map((r) => monthLabel(r.date));
  const trendCounts = trends.map((r) => Number(r.count || 0));
  const avgTrend = trendCounts.length ? trendCounts.reduce((a, b) => a + b, 0) / trendCounts.length : 0;
  const competition = trendCounts.map((v) => Number(((v / (avgTrend || 1)) * 5).toFixed(2)));

  const matrixDomains = [...new Set(matrix.map((m) => m.domain || "Не указано"))];
  const matrixGrades = [...new Set(matrix.map((m) => m.grade || "Не указано"))];
  const matrixGrid = matrix.map((m) => [
    matrixDomains.indexOf(m.domain || "Не указано"),
    matrixGrades.indexOf(m.grade || "Не указано"),
    Number(m.count || 0),
  ]);
  const matrixMax = matrixGrid.length ? Math.max(...matrixGrid.map((x) => x[2])) : 1;

  const domainMap = toCountMap(byDomain, "domain");
  const gradeMap = toCountMap(byGrade, "grade");
  const domainsForStack = [...new Set(matrixDomains.concat(Object.keys(domainMap)))];
  const gradesForStack = [...new Set(matrixGrades.concat(Object.keys(gradeMap)))];

  const stackSeries = gradesForStack.map((grade) => ({
    name: grade,
    type: "bar",
    stack: "matrix",
    data: domainsForStack.map((domain) => {
      const hit = matrix.find((m) => (m.domain || "Не указано") === domain && (m.grade || "Не указано") === grade);
      return Number(hit?.count || 0);
    }),
  }));

  return {
    trendLabels,
    trendCounts,
    competition,
    byDomainPie: byDomain.map((r) => ({ name: r.domain || "Не указано", value: Number(r.count || 0) })),
    topSkillsNames: topSkills.map((r) => r.skill),
    topSkillsCounts: topSkills.map((r) => Number(r.count || 0)),
    regionNames: byRegion.map((r) => r.region || "Не указано"),
    regionCounts: byRegion.map((r) => Number(r.count || 0)),
    sourcesPie: bySource.map((r) => ({ name: r.source || "unknown", value: Number(r.count || 0) })),
    gradesNames: byGrade.map((r) => r.grade || "Не указано"),
    gradesCounts: byGrade.map((r) => Number(r.count || 0)),
    salaryNames: salary.map((r) => r.domain || "Не указано"),
    salaryMedian: salary.map((r) => Number(r.median_salary || 0)),
    salaryAvg: salary.map((r) => Number((r.avg_salary || 0).toFixed(0))),
    stackDomains: domainsForStack,
    stackSeries,
    matrixDomains,
    matrixGrades,
    matrixGrid,
    matrixMax,
    salaryCoverage: p.stats?.total_vacancies
      ? Number(((Number(p.stats.with_salary || 0) / Number(p.stats.total_vacancies || 1)) * 100).toFixed(1))
      : 0,
    totalVacancies: Number(p.stats?.total_vacancies || 0),
    withSalary: Number(p.stats?.with_salary || 0),
    employers: Number(p.stats?.unique_employers || 0),
  };
});

const applyCharts = () => {
  const d = derived.value;
  chartsById["salary-trend"].option.xAxis.data = d.trendLabels;
  chartsById["salary-trend"].option.series[0].data = d.trendCounts;

  chartsById["vacancy-by-sector"].option.series[0].data = d.byDomainPie;

  chartsById["top-skills"].option.xAxis.data = d.topSkillsNames;
  chartsById["top-skills"].option.series[0].data = d.topSkillsCounts;

  chartsById["salary-by-region"].option.xAxis.data = d.regionNames;
  chartsById["salary-by-region"].option.series[0].data = d.regionCounts;

  chartsById["community-categories"].option.series[0].data = d.sourcesPie;

  chartsById["region-comparison"].option.xAxis.data = d.gradesNames;
  chartsById["region-comparison"].option.series[0].data = d.gradesCounts;

  chartsById["competition-index"].option.xAxis.data = d.trendLabels;
  chartsById["competition-index"].option.series[0].data = d.competition;

  chartsById["vacancy-dynamics"].option.xAxis.data = d.trendLabels;
  chartsById["vacancy-dynamics"].option.series[0].data = d.trendCounts;
  chartsById["vacancy-dynamics"].option.series[1].data = d.salaryAvg;

  chartsById["remote-share"].option.xAxis.data = d.stackDomains;
  chartsById["remote-share"].option.series = d.stackSeries;

  chartsById["skills-radar"].option.radar.indicator = d.topSkillsNames.slice(0, 6).map((s) => ({ name: s, max: Math.max(...d.topSkillsCounts, 1) }));
  chartsById["skills-radar"].option.series[0].data = [{ value: d.topSkillsCounts.slice(0, 6), name: "Спрос" }];

  chartsById["kpi-gauge"].option.series[0].data = [{ value: d.salaryCoverage, name: "С указанием" }];
  chartsById["kpi-gauge"].title = `Покрытие зарплат (${d.withSalary}/${d.totalVacancies})`;

  chartsById["response-speed"].option.xAxis.data = d.matrixDomains;
  chartsById["response-speed"].option.yAxis.data = d.matrixGrades;
  chartsById["response-speed"].option.visualMap.max = d.matrixMax;
  chartsById["response-speed"].option.series[0].data = d.matrixGrid;

  chartsById["salary-distribution"].option.xAxis.data = d.salaryNames;
  chartsById["salary-distribution"].option.series[0].data = d.salaryMedian;
  chartsById["vacancy-by-sector"].title = `Вакансии по направлениям (работодателей: ${d.employers})`;
};

const layout = ref([
  { i: "salary-trend", x: 0, y: 0, w: 6, h: 3 },
  { i: "vacancy-by-sector", x: 6, y: 0, w: 6, h: 3 },
  { i: "top-skills", x: 0, y: 3, w: 6, h: 3 },
  { i: "salary-by-region", x: 6, y: 3, w: 6, h: 3 },
  { i: "community-categories", x: 0, y: 6, w: 6, h: 3 },
  { i: "region-comparison", x: 6, y: 6, w: 6, h: 3 },
  { i: "competition-index", x: 0, y: 9, w: 6, h: 3 },
  { i: "vacancy-dynamics", x: 6, y: 9, w: 6, h: 3 },
  { i: "kpi-gauge", x: 0, y: 12, w: 4, h: 3 },
  { i: "remote-share", x: 4, y: 12, w: 4, h: 3 },
  { i: "skills-radar", x: 8, y: 12, w: 4, h: 3 },
  { i: "response-speed", x: 0, y: 15, w: 6, h: 3 },
  { i: "salary-distribution", x: 6, y: 15, w: 6, h: 3 },
]);

const onLayoutUpdated = (updatedLayout) => {
  layout.value = updatedLayout;
};

onMounted(async () => {
  await dashboardStore.fetchDashboardData();
  applyCharts();
});

watch(
  () => dashboardState.payload,
  () => {
    applyCharts();
  },
  { deep: true },
);

watch(
  () => dashboardState.filters.sources,
  () => {
    applyCharts();
  },
  { deep: true },
);

watch(
  () => dashboardState.filters.dateRange,
  () => {
    applyCharts();
  },
  { deep: true },
);
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  min-height: calc(100vh - 32px);
  padding: 6px 4px 14px;
  box-sizing: border-box;
}

.dashboard-panel {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid #e4eaf3;
  background: linear-gradient(180deg, #f9fbff 0%, #f4f8ff 60%, #f6f9ff 100%);
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(64, 87, 130, 0.08);
}

.dashboard-alert {
  margin-top: 12px;
}

.drag-panel__label {
  margin-bottom: 10px;
}

:deep(.vue-grid-layout) {
  min-height: 420px;
}

.grid-item {
  min-height: 240px;
  border-radius: 14px;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  border-radius: 14px;
  background: rgba(79, 123, 247, 0.2);
  border: 1px dashed rgba(79, 123, 247, 0.45);
}
</style>