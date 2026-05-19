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

const fetchDashboardData = async () => {
  state.loading = true;
  state.error = "";
  try {
    const params = getFilterParams();
    const [
      stats,
      trends,
      topSkills,
      byDomain,
      byRegion,
      bySource,
      byGrade,
      salaryByDomain,
      domainGradeMatrix,
    ] = await Promise.all([
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
  } catch (error) {
    state.error = error.message || "Ошибка загрузки аналитики";
  } finally {
    state.loading = false;
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
