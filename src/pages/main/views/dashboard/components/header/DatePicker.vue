<template>
  <div class="date-picker-wrap">
    <el-date-picker
        v-model="val"
        type="daterange"
        range-separator="—"
        start-placeholder="Дата начала"
        end-placeholder="Дата конца"
        value-format="YYYY-MM-DD"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";

const val = ref(["2026-01-01", "2026-03-01"]);
</script>

<style scoped>
.date-picker-wrap {
  min-width: 320px;
}
</style>