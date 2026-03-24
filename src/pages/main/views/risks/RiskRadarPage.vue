<template>
  <section class="module-page">
    <div class="page-header">
      <el-text size="large" tag="b">Радар рисков</el-text>
    </div>

    <el-row :gutter="16" class="risk-stats">
      <el-col :xs="24" :md="6" v-for="item in stats" :key="item.label">
        <el-card shadow="never" class="risk-stat">
          <div class="risk-stat__label">{{ item.label }}</div>
          <div class="risk-stat__value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">Реестр рисков найма</div>
      </template>
      <el-table :data="risks">
        <el-table-column prop="risk" label="Риск" min-width="240" />
        <el-table-column prop="impact" label="Влияние" width="150" />
        <el-table-column prop="probability" label="Вероятность" width="150" />
        <el-table-column prop="action" label="Контроль" min-width="220" />
        <el-table-column label="Уровень" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="levelType[row.level]">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
const stats = [
  { label: "Критичных рисков", value: 3 },
  { label: "Под контролем", value: 9 },
  { label: "Требуют эскалации", value: 2 },
  { label: "Средний SLA", value: "4.2 дня" },
];

const risks = [
  {
    risk: "Рост контрофферов в сегменте Senior Data",
    impact: "Высокое",
    probability: "Высокая",
    action: "Ранний оффер + персональный бонус",
    level: "Высокий",
  },
  {
    risk: "Низкая конверсия интервью в оффер",
    impact: "Среднее",
    probability: "Средняя",
    action: "Калибровка интервьюеров и чек-листа",
    level: "Средний",
  },
  {
    risk: "Задержки на этапе согласования бюджета",
    impact: "Высокое",
    probability: "Средняя",
    action: "Еженедельный обзор статуса рисков",
    level: "Средний",
  },
  {
    risk: "Дефицит кандидатов в регионах",
    impact: "Среднее",
    probability: "Низкая",
    action: "Релокационный пакет и удаленный формат",
    level: "Низкий",
  },
];

const levelType = {
  Высокий: "danger",
  Средний: "warning",
  Низкий: "success",
};
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

.risk-stats {
  margin-bottom: 18px;
}

.risk-stat {
  border-radius: 12px;
  border-color: #e7edf7;
}

.risk-stat__label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.risk-stat__value {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
  color: #29456f;
}

.card-header {
  font-weight: 600;
}
</style>
