<template>
  <div class="date-picker-wrap">
    <el-date-picker
        v-model="val"
        type="daterange"
        range-separator="—"
        start-placeholder="Дата начала"
        end-placeholder="Дата конца"
        value-format="YYYY-MM-DD"
        clearable
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@app/store/useDashboardStore";

const dashboardStore = useDashboardStore();
const val = computed({
  get: () => dashboardStore.state.filters.dateRange,
  set: (value) => dashboardStore.setDateRange(value),
});
</script>

<style scoped>
.date-picker-wrap {
  min-width: 320px;
}
</style>