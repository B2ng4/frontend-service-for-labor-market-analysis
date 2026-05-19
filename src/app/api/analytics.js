import { apiRequest } from "@app/api/client";

const ANALYTICS_BASE = "/api/v1/analytics";

const createQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

export async function getRecommendations(token, params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/recommendations${createQuery(params)}`, {
    method: "GET",
    token,
  });
}

export async function searchVacancies(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/vacancies/search${createQuery(params)}`, {
    method: "GET",
  });
}

export async function uploadResume(token, file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(`${ANALYTICS_BASE}/profile/resume`, {
    method: "POST",
    token,
    body: formData,
  });
}

export async function getCandidateProfile(token) {
  return apiRequest(`${ANALYTICS_BASE}/profile`, {
    method: "GET",
    token,
  });
}

export async function getStats(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/stats${createQuery(params)}`, { method: "GET" });
}

export async function getTrends(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/trends${createQuery(params)}`, { method: "GET" });
}

export async function getTopSkills(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/top-skills${createQuery(params)}`, { method: "GET" });
}

export async function getByDomain(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/by-domain${createQuery(params)}`, { method: "GET" });
}

export async function getByRegion(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/by-region${createQuery(params)}`, { method: "GET" });
}

export async function getBySource(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/sources${createQuery(params)}`, { method: "GET" });
}

export async function getByGrade(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/by-grade${createQuery(params)}`, { method: "GET" });
}

export async function getSalaryStats(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/salary${createQuery(params)}`, { method: "GET" });
}

export async function getDomainGradeMatrix(params = {}) {
  return apiRequest(`${ANALYTICS_BASE}/domain-grade-matrix${createQuery(params)}`, { method: "GET" });
}
