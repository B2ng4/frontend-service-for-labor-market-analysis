import { ref, computed } from "vue";

const FAVORITES_KEY = "lm_favorites";
const VIEWED_KEY = "lm_viewed";
const REPORT_KEY = "lm_report";

const loadJson = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

const mockVacancies = [
  { id: "1", title: "Data Analyst", company: "FinTech Corp", salary: "от 180 000 ₽", salaryMin: 180000, salaryMax: 250000, match: 95, tags: ["SQL", "Python", "Tableau"], region: "Москва", source: "hh", url: "https://hh.ru/vacancy/123456" },
  { id: "2", title: "Бизнес-аналитик", company: "Retail Group", salary: "150 000 – 200 000 ₽", salaryMin: 150000, salaryMax: 200000, match: 88, tags: ["Excel", "BI", "Power BI"], region: "Москва", source: "hh", url: "https://hh.ru/vacancy/123457" },
  { id: "3", title: "Аналитик данных", company: "HRTech", salary: "от 170 000 ₽", salaryMin: 170000, salaryMax: null, match: 82, tags: ["SQL", "Python", "ETL"], region: "Санкт-Петербург", source: "superjob", url: "https://superjob.ru/vacancy/123458" },
  { id: "4", title: "Junior Data Scientist", company: "IT Startup", salary: "120 000 – 150 000 ₽", salaryMin: 120000, salaryMax: 150000, match: 78, tags: ["Python", "ML", "Pandas"], region: "Москва", source: "avito", url: "https://avito.ru/vacancy/123459" },
  { id: "5", title: "BI-разработчик", company: "Банк", salary: "от 200 000 ₽", salaryMin: 200000, salaryMax: null, match: 75, tags: ["Power BI", "SQL", "DAX"], region: "Москва", source: "hh", url: "https://hh.ru/vacancy/123460" },
  { id: "6", title: "Аналитик", company: "E-commerce", salary: "140 000 – 180 000 ₽", salaryMin: 140000, salaryMax: 180000, match: 72, tags: ["SQL", "Excel", "Google Analytics"], region: "Санкт-Петербург", source: "avito", url: "https://avito.ru/vacancy/123461" },
  { id: "7", title: "Product Analyst", company: "Tech Corp", salary: "от 190 000 ₽", salaryMin: 190000, salaryMax: null, match: 90, tags: ["SQL", "Python", "A/B тесты"], region: "Москва", source: "superjob", url: "https://superjob.ru/vacancy/123462" },
];

const vacancies = ref([...mockVacancies]);
const userSkills = ref(loadJson("lm_userSkills", ["SQL", "Python", "Excel"]));
const favorites = ref(new Set(loadJson(FAVORITES_KEY, [])));
const viewed = ref(loadJson(VIEWED_KEY, []));
const resumeReport = ref(loadJson(REPORT_KEY, null));
const resumeStatus = ref(loadJson("lm_resumeStatus", "idle"));

function toggleFavorite(id) {
    const s = new Set(favorites.value);
    if (s.has(id)) s.delete(id);
    else s.add(id);
  favorites.value = s;
  saveJson(FAVORITES_KEY, [...s]);
}

function isFavorite(id) {
  return favorites.value.has(id);
}

function addViewed(vacancy) {
    const arr = viewed.value.filter((v) => v.id !== vacancy.id);
    arr.unshift({ ...vacancy, viewedAt: Date.now() });
  viewed.value = arr.slice(0, 20);
  saveJson(VIEWED_KEY, viewed.value);
}

function setResumeReport(report) {
    resumeReport.value = report;
    if (report) {
      userSkills.value = report.skills || [];
      resumeStatus.value = "ready";
    }
  saveJson(REPORT_KEY, report);
  saveJson("lm_userSkills", userSkills.value);
  saveJson("lm_resumeStatus", resumeStatus.value);
}

function setResumeStatus(status) {
  resumeStatus.value = status;
  saveJson("lm_resumeStatus", status);
}

function getMissingSkills(vacancyTags) {
  const user = new Set(userSkills.value.map((s) => s.toLowerCase?.() ?? s));
  return (vacancyTags || []).filter((t) => !user.has((t.toLowerCase?.() ?? t)));
}

function getMatchedSkills(vacancyTags) {
  const user = new Set(userSkills.value.map((s) => s.toLowerCase?.() ?? s));
  return (vacancyTags || []).filter((t) => user.has((t.toLowerCase?.() ?? t)));
}

const favoriteVacancies = computed(() =>
  vacancies.value.filter((v) => favorites.value.has(v.id))
);

export function useAppStore() {
  return {
    vacancies,
    userSkills,
    favorites,
    viewed,
    resumeReport,
    resumeStatus,
    toggleFavorite,
    isFavorite,
    addViewed,
    setResumeReport,
    setResumeStatus,
    getMissingSkills,
    getMatchedSkills,
    favoriteVacancies,
  };
}
