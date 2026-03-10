<template>
  <el-card class="vacancy-card" shadow="hover">
    <div class="vacancy-card__header">
      <span class="vacancy-card__title">{{ vacancy.title }}</span>
      <el-tag v-if="vacancy.match" type="success" size="small" round>
        {{ vacancy.match }}% совпадение
      </el-tag>
    </div>
    <div class="vacancy-card__company">{{ vacancy.company }}</div>
    <div v-if="vacancy.salary" class="vacancy-card__salary">{{ vacancy.salary }}</div>
    <div v-if="vacancy.tags?.length" class="vacancy-card__tags">
      <el-tag
        v-for="tag in vacancy.tags"
        :key="tag"
        size="small"
        type="info"
        class="vacancy-card__tag"
      >
        {{ tag }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  vacancy: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.vacancy-card {
  min-width: 260px;
  max-width: 260px;
  border-radius: 12px;
  border: 1px solid #e4eaf3;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.vacancy-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 87, 130, 0.12);
}

.vacancy-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.vacancy-card__title {
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
  flex: 1;
}

.vacancy-card__company {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7c93;
}

.vacancy-card__salary {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4f7bf7;
}

.vacancy-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.vacancy-card__tag {
  font-size: 12px;
}
</style>
