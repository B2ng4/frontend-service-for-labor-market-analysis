<template>
  <article class="chart-card">
    <div class="chart-card__header">
      <el-text class="chart-card__title" size="large">{{ chart.title }}</el-text>
      <div class="chart-card__actions">
        <div v-if="showDragHandle" class="chart-card__drag-handle drag-handle">
          <el-icon><Rank /></el-icon>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="chart-card__content"></div>
  </article>
</template>

<script setup>
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Rank } from "@element-plus/icons-vue";

const props = defineProps({
  chart: {
    type: Object,
    required: true,
  },
  showDragHandle: {
    type: Boolean,
    default: false,
  },
});

const chartRef = ref(null);
let chartInstance = null;
let resizeObserver = null;

const renderChart = () => {
  if (!chartInstance) return;
  chartInstance.setOption(props.chart.option, true);
};

const initChart = async () => {
  await nextTick();
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  renderChart();
};

const handleResize = () => {
  if (!chartInstance) return;
  chartInstance.resize();
};

onMounted(async () => {
  await initChart();
  window.addEventListener("resize", handleResize);
  if (typeof ResizeObserver !== "undefined" && chartRef.value) {
    resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(chartRef.value);
  }
});

watch(
  () => props.chart.option,
  () => {
    renderChart();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (!chartInstance) return;
  chartInstance.dispose();
  chartInstance = null;
});
</script>

<style scoped>
.chart-card {
  border-radius: 14px;
  padding: 14px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(63, 75, 95, 0.08);
  border: 1px solid #e9eef5;
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(63, 75, 95, 0.12);
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.chart-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-card__title {
  color: #1f2937;
  font-weight: 600;
}

.chart-card__drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #dde5f0;
  color: #7a8ba3;
  cursor: grab;
}

.chart-card__content {
  width: 100%;
  height: calc(100% - 36px);
}
</style>
