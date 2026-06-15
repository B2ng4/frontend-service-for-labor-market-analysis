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
    <div class="chart-card__body">
      <div v-if="loading" class="chart-skeleton">
        <el-skeleton animated>
          <template #template>
            <div class="chart-skeleton__plot">
              <el-skeleton-item class="chart-skeleton__line chart-skeleton__line--wide" variant="text" />
              <el-skeleton-item class="chart-skeleton__line" variant="text" />
              <div class="chart-skeleton__bars">
                <el-skeleton-item
                  v-for="height in skeletonBars"
                  :key="height"
                  class="chart-skeleton__bar"
                  :style="{ height }"
                  variant="rect"
                />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
      <div v-show="!loading" ref="chartRef" class="chart-card__content"></div>
    </div>
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
  loading: {
    type: Boolean,
    default: false,
  },
});

const chartRef = ref(null);
const skeletonBars = ["42%", "68%", "54%", "82%", "63%", "76%", "48%"];
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

watch(
  () => props.loading,
  async (loading) => {
    if (loading) return;
    await nextTick();
    handleResize();
    renderChart();
  },
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

.chart-card__body,
.chart-card__content {
  width: 100%;
  height: calc(100% - 36px);
}

.chart-card__body {
  position: relative;
}

.chart-skeleton {
  height: 100%;
  min-height: 170px;
}

.chart-skeleton :deep(.el-skeleton) {
  height: 100%;
}

.chart-skeleton__plot {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 170px;
  padding: 10px 4px 4px;
}

.chart-skeleton__line {
  width: 62%;
  height: 12px;
  margin-bottom: 10px;
}

.chart-skeleton__line--wide {
  width: 84%;
}

.chart-skeleton__bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex: 1;
  padding-top: 14px;
}

.chart-skeleton__bar {
  flex: 1;
  min-width: 12px;
  border-radius: 6px 6px 2px 2px;
}
</style>
