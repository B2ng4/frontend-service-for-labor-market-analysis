import { reactive } from "vue";
import {
  getStats,
  getTrends,
  getTopSkills,
  getByDomain,
  getByRegion,
  getBySource,
  getByGrade,
  getSalaryStats,
  getDomainGradeMatrix,
} from "@app/api/analytics";

const state = reactive({
  filters: {
    sources: ["hh", "superjob", "avito"],
    dateRange: [],
  },
  loading: false,
  error: "",
  hasLoaded: false,
  lastUpdatedAt: null,
  payload: {
    stats: null,
    trends: [],
    topSkills: [],
    byDomain: [],
    byRegion: [],
    bySource: [],
    byGrade: [],
    salaryByDomain: [],
    domainGradeMatrix: [],
  },
});

const normalizeDate = (value) => (value ? String(value).slice(0, 10) : undefined);

const getFilterParams = () => {
  const [from, to] = state.filters.dateRange || [];
  return {
    date_from: normalizeDate(from),
    date_to: normalizeDate(to),
  };
};

const filterBySources = (rows) => {
  const selected = new Set((state.filters.sources || []).map((s) => String(s).toLowerCase()));
  if (!selected.size) return rows;
  return (rows || []).filter((row) => selected.has(String(row.source || "").toLowerCase()));
};

const asArray = (value) => (Array.isArray(value) ? value : []);
const asObject = (value) => (value && typeof value === "object" ? value : null);

let requestSeq = 0;

const fetchDashboardData = async () => {
  const currentSeq = ++requestSeq;
  state.loading = true;
  state.error = "";
  try {
    const params = getFilterParams();
    const results = await Promise.allSettled([
      getStats(params),
      getTrends({ ...params, days: 180 }),
      getTopSkills({ ...params, limit: 12 }),
      getByDomain({ ...params, limit: 10 }),
      getByRegion({ ...params, limit: 10 }),
      getBySource({ ...params, limit: 10 }),
      getByGrade({ ...params, limit: 10 }),
      getSalaryStats({ ...params, group_by: "domain", limit: 10 }),
      getDomainGradeMatrix(params),
    ]);

    if (currentSeq !== requestSeq) return;

    const [statsRes, trendsRes, topSkillsRes, byDomainRes, byRegionRes, bySourceRes, byGradeRes, salaryRes, matrixRes] = results;
    const errors = results
      .filter((item) => item.status === "rejected")
      .map((item) => item.reason?.message || "неизвестная ошибка");

    const stats = statsRes.status === "fulfilled" ? asObject(statsRes.value) : null;
    const trends = trendsRes.status === "fulfilled" ? asArray(trendsRes.value) : [];
    const topSkills = topSkillsRes.status === "fulfilled" ? asArray(topSkillsRes.value) : [];
    const byDomain = byDomainRes.status === "fulfilled" ? asArray(byDomainRes.value) : [];
    const byRegion = byRegionRes.status === "fulfilled" ? asArray(byRegionRes.value) : [];
    const bySource = bySourceRes.status === "fulfilled" ? asArray(bySourceRes.value) : [];
    const byGrade = byGradeRes.status === "fulfilled" ? asArray(byGradeRes.value) : [];
    const salaryByDomain = salaryRes.status === "fulfilled" ? asArray(salaryRes.value) : [];
    const domainGradeMatrix = matrixRes.status === "fulfilled" ? asArray(matrixRes.value) : [];

    state.payload = {
      stats,
      trends,
      topSkills,
      byDomain,
      byRegion,
      bySource: filterBySources(bySource),
      byGrade,
      salaryByDomain,
      domainGradeMatrix,
    };
    state.hasLoaded = true;
    state.lastUpdatedAt = new Date().toISOString();
    if (errors.length) {
      state.error = `Часть аналитики недоступна: ${errors[0]}`;
    }
  } catch (error) {
    if (currentSeq !== requestSeq) return;
    state.error = error.message || "Ошибка загрузки аналитики";
  } finally {
    if (currentSeq === requestSeq) {
      state.loading = false;
    }
  }
};

const setSources = (sources) => {
  state.filters.sources = Array.isArray(sources) ? sources : [];
};

const setDateRange = (range) => {
  state.filters.dateRange = Array.isArray(range) ? range : [];
};

export function useDashboardStore() {
  return {
    state,
    setSources,
    setDateRange,
    fetchDashboardData,
  };
}
