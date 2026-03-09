<template>
  <div class="layout">
    <div>
      <el-text size="large" tag="b">Аналитическая панель рынка труда</el-text>
    </div>
    <div class="layout__controls">
      <source-select />
      <date-picker />
    </div>
  </div>
</template>

<script setup>
import SourceSelect from "@pages/main/views/dashboard/components/header/SourceSelect.vue";
import DatePicker from "@pages/main/views/dashboard/components/header/DatePicker.vue";

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