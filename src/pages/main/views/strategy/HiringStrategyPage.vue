<template>
  <section class="module-page">
    <div class="page-header">
      <el-text size="large" tag="b">РЎС‚СЂР°С‚РµРіРёСЏ РЅР°Р№РјР°</el-text>
    </div>
    <el-alert v-if="error" type="warning" :title="error" show-icon class="module-alert" />

    <el-card shadow="never" class="strategy-card">
      <template #header>
        <div class="card-header">РџСЂРёРѕСЂРёС‚РµС‚С‹ РЅР°Р№РјР° РїРѕ РЅР°РїСЂР°РІР»РµРЅРёСЏРј</div>
      </template>
      <el-skeleton v-if="loading && !priorities.length" class="module-skeleton" :rows="5" animated />
      <div v-else v-loading="loading" class="strategy-grid">
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
        <div class="card-header">РџР»Р°РЅРѕРІС‹Рµ РѕРєРЅР° РЅР°Р№РјР°</div>
      </template>
      <el-skeleton v-if="loading && !timeline.length" class="module-skeleton" :rows="4" animated />
      <el-table v-else v-loading="loading" :data="timeline">
        <el-table-column prop="period" label="РџРµСЂРёРѕРґ" width="140" />
        <el-table-column prop="target" label="Р¦РµР»СЊ" min-width="220" />
        <el-table-column prop="owner" label="РћС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№" width="180" />
        <el-table-column label="РЎС‚Р°С‚СѓСЃ" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Р’ С„РѕРєСѓСЃРµ' ? 'primary' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getByDomain, getByGrade, getSalaryStats, getTopSkills } from "@app/api/analytics";

const loading = ref(false);
const error = ref("");
const data = ref({
  domains: [],
  grades: [],
  salary: [],
  skills: [],
});

const priorities = computed(() => {
  const salaryMap = Object.fromEntries((data.value.salary || []).map((s) => [s.domain || "РќРµ СѓРєР°Р·Р°РЅРѕ", Number(s.avg_salary || 0)]));
  return (data.value.domains || []).slice(0, 4).map((domain) => {
    const count = Number(domain.count || 0);
    const priority = Math.min(100, Math.round((count / 1500) * 100));
    const budget = Math.max(600000, Math.round((salaryMap[domain.domain] || 120000) * 8));
    return {
      team: domain.domain || "РќРµ СѓРєР°Р·Р°РЅРѕ",
      budget: `${budget.toLocaleString("ru-RU")} в‚Ѕ`,
      priority,
      note: `РЎРµРіРјРµРЅС‚ СЃРѕРґРµСЂР¶РёС‚ ${count.toLocaleString("ru-RU")} РІР°РєР°РЅСЃРёР№`,
    };
  });
});

const timeline = computed(() => {
  const grades = (data.value.grades || []).slice(0, 3);
  const months = ["РўРµРєСѓС‰РёР№ РјРµСЃСЏС†", "РЎР»РµРґСѓСЋС‰РёР№", "Р§РµСЂРµР· 2 РјРµСЃСЏС†Р°"];
  return grades.map((grade, index) => ({
    period: months[index] || `РћРєРЅРѕ ${index + 1}`,
    target: `Р¤РѕРєСѓСЃ РЅР° РЅР°Р№РјРµ СѓСЂРѕРІРЅСЏ ${grade.grade || "РЅРµ СѓРєР°Р·Р°РЅ"} (${grade.count} РІР°РєР°РЅСЃРёР№ РІ СЂС‹РЅРєРµ)`,
    owner: index === 0 ? "HR-РїР°СЂС‚РЅРµСЂ" : index === 1 ? "Р СѓРєРѕРІРѕРґРёС‚РµР»СЊ Data" : "Р›РёРґ СЂРµРєСЂСѓС‚РёРЅРіР°",
    status: index === 0 ? "Р’ С„РѕРєСѓСЃРµ" : "Р—Р°РїР»Р°РЅРёСЂРѕРІР°РЅРѕ",
  }));
});

const loadData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const [domains, grades, salary, skills] = await Promise.all([
      getByDomain({ limit: 10 }),
      getByGrade({ limit: 10 }),
      getSalaryStats({ group_by: "domain", limit: 10 }),
      getTopSkills({ limit: 15 }),
    ]);
    data.value = { domains, grades, salary, skills };
  } catch (err) {
    error.value = err.message || "РќРµ СѓРґР°Р»РѕСЃСЊ СЃС„РѕСЂРјРёСЂРѕРІР°С‚СЊ СЃС‚СЂР°С‚РµРіРёСЋ РЅР°Р№РјР°";
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
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

.module-alert {
  margin-bottom: 12px;
}

.module-skeleton {
  padding: 8px 0;
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

