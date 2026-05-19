<template>
  <div class="source-select">
    <el-select
      v-model="selectedSources"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="Источники данных"
      style="min-width: 280px"
    >
      <el-option
        v-for="item in sourceOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDashboardStore } from "@app/store/useDashboardStore";

const dashboardStore = useDashboardStore();
const selectedSources = computed({
  get: () => dashboardStore.state.filters.sources,
  set: (value) => dashboardStore.setSources(value),
});

const sourceOptions = [
  { label: "HeadHunter", value: "hh" },
  { label: "SuperJob", value: "superjob" },
  { label: "Avito Работа", value: "avito" },
];
</script>

<style scoped>
.source-select {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>