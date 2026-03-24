<template>
  <section class="module-page">
    <div class="page-header">
      <el-text size="large" tag="b">Стратегия найма</el-text>
    </div>

    <el-card shadow="never" class="strategy-card">
      <template #header>
        <div class="card-header">Приоритеты найма по направлениям</div>
      </template>
      <div class="strategy-grid">
        <div v-for="item in priorities" :key="item.team" class="strategy-item">
          <div class="strategy-item__head">
            <span class="team">{{ item.team }}</span>
            <span class="budget">{{ item.budget }}</span>
          </div>
          <el-progress :percentage="item.priority" :status="item.priority > 80 ? 'success' : ''" />
          <div class="meta">{{ item.note }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="strategy-card">
      <template #header>
        <div class="card-header">Плановые окна найма</div>
      </template>
      <el-table :data="timeline">
        <el-table-column prop="period" label="Период" width="140" />
        <el-table-column prop="target" label="Цель" min-width="220" />
        <el-table-column prop="owner" label="Ответственный" width="180" />
        <el-table-column label="Статус" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'В фокусе' ? 'primary' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
const priorities = [
  { team: "Платформа данных", budget: "2.4 млн ₽", priority: 88, note: "Ускорение закрытия backend-ролей" },
  { team: "Продуктовая аналитика", budget: "1.6 млн ₽", priority: 76, note: "Рост спроса на A/B экспертизу" },
  { team: "BI-направление", budget: "1.1 млн ₽", priority: 69, note: "Поддержка региональной экспансии" },
];

const timeline = [
  { period: "Апрель", target: "Набор 4 middle-аналитиков", owner: "HR-партнер", status: "В фокусе" },
  { period: "Май", target: "Открытие 2 senior-позиций", owner: "Руководитель Data", status: "Запланировано" },
  { period: "Июнь", target: "Усиление BI-команды (3 роли)", owner: "Лид рекрутинга", status: "Запланировано" },
];
</script>

<style scoped>
.module-page {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.strategy-card {
  margin-bottom: 18px;
  border-radius: 12px;
}

.card-header {
  font-weight: 600;
}

.strategy-grid {
  display: grid;
  gap: 14px;
}

.strategy-item {
  padding: 14px;
  border: 1px solid #e4eaf3;
  border-radius: 10px;
  background: #fbfdff;
}

.strategy-item__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.team {
  font-weight: 600;
  color: #2f4a77;
}

.budget {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.meta {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
