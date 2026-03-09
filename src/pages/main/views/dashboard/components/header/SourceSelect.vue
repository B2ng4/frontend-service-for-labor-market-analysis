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
import { ref } from "vue";
import { DataLine } from "@element-plus/icons-vue";

const selectedSources = ref(["hh", "superjob"]);

const sourceOptions = [
  { label: "HeadHunter", value: "hh" },
  { label: "SuperJob", value: "superjob" },
  { label: "Avito Работа", value: "avito" },
  { label: "Rabota.ru", value: "rabota" },
];
</script>

<style scoped>
.source-select {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>