<template>
  <section class="dashboard-page">
    <dashboard-header />

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
import { reactive, ref } from "vue";
import { GridLayout, GridItem } from "vue-grid-layout-v3";
import DashboardHeader from "@pages/main/views/dashboard/components/header/DashboardHeader.vue";
import EChartCard from "@pages/main/views/dashboard/components/charts/EChartCard.vue";

const chartsById = reactive({
  "salary-trend": {
    id: "salary-trend",
    title: "Динамика средней зарплаты",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      },
      yAxis: { type: "value", name: "тыс. руб." },
      series: [
        {
          data: [92, 95, 97, 102, 107, 110],
          type: "line",
          smooth: true,
          areaStyle: { opacity: 0.12 },
        },
      ],
      color: ["#4F7BF7"],
    },
  },
  "vacancy-by-sector": {
    id: "vacancy-by-sector",
    title: "Вакансии по направлениям",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["42%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            { value: 335, name: "IT" },
            { value: 240, name: "Финансы" },
            { value: 188, name: "Медицина" },
            { value: 124, name: "Маркетинг" },
            { value: 98, name: "Производство" },
          ],
        },
      ],
      color: ["#4F7BF7", "#36CFC9", "#A98BFF", "#FFB347", "#FF6B72"],
    },
  },
  "top-skills": {
    id: "top-skills",
    title: "Топ навыков",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["SQL", "Python", "Excel", "Power BI", "Tableau", "ETL"],
      },
      yAxis: { type: "value", name: "вакансий" },
      series: [{ type: "bar", data: [890, 720, 650, 480, 420, 380], barWidth: "55%" }],
      color: ["#4F7BF7"],
    },
  },
  "salary-by-region": {
    id: "salary-by-region",
    title: "Средняя зарплата по региону (тыс. ₽)",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Москва", "СПб", "Казань", "Екб", "Новосиб"],
      },
      yAxis: { type: "value" },
      series: [{ type: "bar", data: [185, 155, 125, 115, 105], barWidth: "55%" }],
      color: ["#36CFC9"],
    },
  },
  "community-categories": {
    id: "community-categories",
    title: "Популярные категории сообществ ВК",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [{
        type: "pie",
        radius: ["42%", "70%"],
        data: [
          { value: 420, name: "IT и разработка" },
          { value: 280, name: "Маркетинг" },
          { value: 220, name: "Финансы" },
          { value: 180, name: "Дизайн" },
          { value: 140, name: "HR" },
        ],
      }],
      color: ["#4F7BF7", "#36CFC9", "#A98BFF", "#FFB347", "#FF6B72"],
    },
  },
  "region-comparison": {
    id: "region-comparison",
    title: "Сравнение регионов по откликам",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Москва", "СПб", "Казань", "Екб", "Новосиб"],
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: [920, 680, 510, 460, 380],
          barWidth: "45%",
        },
      ],
      color: ["#6E9BFF"],
    },
  },
  "competition-index": {
    id: "competition-index",
    title: "Индекс конкуренции по месяцам",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      },
      yAxis: { type: "value", min: 0, max: 10 },
      series: [
        {
          type: "line",
          smooth: true,
          symbolSize: 8,
          data: [4.2, 4.5, 5.1, 5.8, 5.6, 5.9],
        },
      ],
      color: ["#9C6DFF"],
    },
  },
  "vacancy-dynamics": {
    id: "vacancy-dynamics",
    title: "Динамика вакансий и откликов",
    option: {
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      xAxis: {
        type: "category",
        data: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Вакансии",
          type: "line",
          smooth: true,
          data: [1200, 1280, 1350, 1440, 1510, 1580, 1630],
        },
        {
          name: "Отклики",
          type: "line",
          smooth: true,
          data: [9100, 9800, 10300, 11100, 11800, 12200, 12900],
        },
      ],
      color: ["#4F7BF7", "#36CFC9"],
    },
  },
  "remote-share": {
    id: "remote-share",
    title: "Формат занятости",
    option: {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { bottom: 0 },
      xAxis: {
        type: "category",
        data: ["IT", "Маркетинг", "Финансы", "Продажи", "Поддержка"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Офис",
          type: "bar",
          stack: "format",
          data: [420, 360, 290, 510, 340],
        },
        {
          name: "Гибрид",
          type: "bar",
          stack: "format",
          data: [300, 240, 210, 260, 190],
        },
        {
          name: "Удаленно",
          type: "bar",
          stack: "format",
          data: [580, 330, 260, 200, 280],
        },
      ],
      color: ["#6E9BFF", "#A98BFF", "#36CFC9"],
    },
  },
  "skills-radar": {
    id: "skills-radar",
    title: "Востребованные навыки",
    option: {
      tooltip: {},
      legend: { top: 0 },
      radar: {
        radius: "60%",
        indicator: [
          { name: "SQL", max: 100 },
          { name: "Python", max: 100 },
          { name: "Excel", max: 100 },
          { name: "BI", max: 100 },
          { name: "ETL", max: 100 },
          { name: "ML", max: 100 },
        ],
      },
      series: [
        {
          name: "Уровень спроса",
          type: "radar",
          data: [
            {
              value: [84, 79, 92, 73, 66, 58],
              name: "2026",
            },
          ],
          areaStyle: { opacity: 0.2 },
        },
      ],
      color: ["#4F7BF7"],
    },
  },
  "kpi-gauge": {
    id: "kpi-gauge",
    title: "Индекс закрытия вакансий",
    option: {
      tooltip: { formatter: "{a}<br/>{b}: {c}%" },
      series: [
        {
          name: "Закрытие",
          type: "gauge",
          progress: { show: true, width: 14 },
          axisLine: { lineStyle: { width: 14 } },
          detail: { valueAnimation: true, formatter: "{value}%" },
          data: [{ value: 73, name: "Успешно" }],
        },
      ],
      color: ["#5ECF8E"],
    },
  },
  "response-speed": {
    id: "response-speed",
    title: "Скорость отклика (дни/недели)",
    option: {
      tooltip: { position: "top" },
      grid: { height: "68%", top: "12%" },
      xAxis: {
        type: "category",
        data: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      },
      yAxis: {
        type: "category",
        data: ["Нед1", "Нед2", "Нед3", "Нед4"],
      },
      visualMap: {
        min: 1,
        max: 9,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 0,
      },
      series: [
        {
          type: "heatmap",
          data: [
            [0, 0, 3], [1, 0, 4], [2, 0, 6], [3, 0, 5], [4, 0, 4], [5, 0, 2], [6, 0, 1],
            [0, 1, 5], [1, 1, 7], [2, 1, 8], [3, 1, 7], [4, 1, 6], [5, 1, 3], [6, 1, 2],
            [0, 2, 4], [1, 2, 6], [2, 2, 7], [3, 2, 6], [4, 2, 5], [5, 2, 4], [6, 2, 3],
            [0, 3, 2], [1, 3, 4], [2, 3, 5], [3, 3, 4], [4, 3, 3], [5, 3, 2], [6, 3, 1],
          ],
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.25)",
            },
          },
        },
      ],
    },
  },
  "salary-distribution": {
    id: "salary-distribution",
    title: "Распределение зарплат",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["50-80", "80-110", "110-140", "140-170", "170-200", "200+"],
      },
      yAxis: { type: "value", name: "кандидатов" },
      series: [
        {
          type: "bar",
          data: [180, 320, 410, 280, 160, 90],
          barWidth: "55%",
        },
      ],
      color: ["#FFB347"],
    },
  },
});

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