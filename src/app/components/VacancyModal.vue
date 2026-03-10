<template>
  <el-dialog v-model="visible" :title="vacancy?.title ?? 'Вакансия'" width="480px" @open="onOpen">
    <div v-if="vacancy">
      <div class="modal-row">
        <el-tag :type="sourceType" size="small">{{ sourceLabel }}</el-tag>
        <el-tag v-if="vacancy.region" type="info" size="small">{{ vacancy.region }}</el-tag>
      </div>
      <el-descriptions :column="1" border style="margin-top: 12px">
        <el-descriptions-item label="Компания">{{ vacancy.company }}</el-descriptions-item>
        <el-descriptions-item label="Зарплата">{{ vacancy.salary }}</el-descriptions-item>
        <el-descriptions-item label="Совпадение">{{ vacancy.match }}%</el-descriptions-item>
        <el-descriptions-item label="Навыки">
          <el-tag v-for="tag in vacancy.tags" :key="tag" size="small" style="margin-right: 4px">{{ tag }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="missingSkills.length" label="Недостающие навыки">
          <el-tag v-for="s in missingSkills" :key="s" type="danger" size="small" effect="plain" style="margin-right: 4px">{{ s }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="showSkillChart && (matchedSkills.length || missingSkills.length)" class="skill-chart">
        <div class="skill-chart__bar">
          <span class="skill-chart__label">Есть</span>
          <div class="skill-chart__track">
            <div class="skill-chart__fill skill-chart__fill--matched" :style="{ width: matchPercent + '%' }" />
          </div>
          <span class="skill-chart__value">{{ matchedSkills.length }}/{{ vacancy.tags?.length || 0 }}</span>
        </div>
        <div class="skill-chart__bar">
          <span class="skill-chart__label">Нужно</span>
          <div class="skill-chart__track">
            <div class="skill-chart__fill skill-chart__fill--missing" :style="{ width: missingPercent + '%' }" />
          </div>
          <span class="skill-chart__value">{{ missingSkills.length }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="vacancy" @click="openCompare">Сравнить с резюме</el-button>
        <a v-if="vacancy" :href="vacancy.url" target="_blank" rel="noopener noreferrer" class="dialog-link">
          <el-button type="primary">Открыть вакансию</el-button>
        </a>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";
import { SOURCE_LABELS, SOURCE_TYPES } from "@app/utils/vacancy";

const props = defineProps({
  modelValue: Boolean,
  vacancy: Object,
  missingSkills: { type: Array, default: () => [] },
  matchedSkills: { type: Array, default: () => [] },
  showSkillChart: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "compare"]);

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const sourceLabel = computed(() => (props.vacancy?.source ? SOURCE_LABELS[props.vacancy.source] ?? props.vacancy.source : ""));
const sourceType = computed(() => (props.vacancy?.source ? SOURCE_TYPES[props.vacancy.source] ?? "info" : "info"));

const total = computed(() => props.vacancy?.tags?.length || 1);
const matchPercent = computed(() => (props.matchedSkills?.length / total.value) * 100);
const missingPercent = computed(() => (props.missingSkills?.length / total.value) * 100);

const onOpen = () => {};

const openCompare = () => {
  emit("compare", props.vacancy);
  visible.value = false;
};
</script>

<style scoped>
.modal-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.skill-chart {
  margin-top: 16px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.skill-chart__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.skill-chart__bar:last-child {
  margin-bottom: 0;
}

.skill-chart__label {
  width: 50px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.skill-chart__track {
  flex: 1;
  height: 8px;
  background: var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;
}

.skill-chart__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.skill-chart__fill--matched {
  background: var(--el-color-success);
}

.skill-chart__fill--missing {
  background: var(--el-color-danger);
}

.skill-chart__value {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-width: 40px;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.dialog-link {
  text-decoration: none;
}
</style>
