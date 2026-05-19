<template>
  <div class="layout">
    <div>
      <el-text size="large" tag="b">Аналитическая панель рынка труда</el-text>
      <div class="layout__sub-title">
        <el-text size="small" type="info">
          {{ subtitle }}
        </el-text>
      </div>
    </div>
    <div class="layout__controls">
      <source-select />
      <date-picker />
      <el-button type="primary" :loading="dashboardStore.state.loading" @click="refresh">Обновить</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import SourceSelect from "@pages/main/views/dashboard/components/header/SourceSelect.vue";
import DatePicker from "@pages/main/views/dashboard/components/header/DatePicker.vue";
import { useDashboardStore } from "@app/store/useDashboardStore";

const dashboardStore = useDashboardStore();

const refresh = async () => {
  await dashboardStore.fetchDashboardData();
};

const subtitle = computed(() => {
  if (!dashboardStore.state.lastUpdatedAt) return "Данные обновляются из backend-service через API Gateway";
  return `Последнее обновление: ${new Date(dashboardStore.state.lastUpdatedAt).toLocaleString("ru-RU")}`;
});

watch(
  () => [dashboardStore.state.filters.sources, dashboardStore.state.filters.dateRange],
  () => {
    refresh();
  },
  { deep: true },
);
</script>

<style scoped>
.layout {
  width: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  border: 1px solid #e9eef5;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.layout__sub-title {
  margin-top: 2px;
}

.layout__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>