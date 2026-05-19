import { api } from "@app/api/client";

const ANALYTICS_BASE = "/api/v1/analytics";

export async function getRecommendations(token, params = {}) {
  return api.get(`${ANALYTICS_BASE}/recommendations`, {
    query: params,
    token,
  });
}

export async function searchVacancies(params = {}) {
  return api.get(`${ANALYTICS_BASE}/vacancies/search`, {
    query: params,
  });
}

export async function uploadResume(token, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`${ANALYTICS_BASE}/profile/resume`, {
    token,
    body: formData,
  });
}

export async function getCandidateProfile(token) {
  return api.get(`${ANALYTICS_BASE}/profile`, {
    token,
  });
}

export async function getStats(params = {}) {
  return api.get(`${ANALYTICS_BASE}/stats`, { query: params });
}

export async function getTrends(params = {}) {
  return api.get(`${ANALYTICS_BASE}/trends`, { query: params });
}

export async function getTopSkills(params = {}) {
  return api.get(`${ANALYTICS_BASE}/top-skills`, { query: params });
}

export async function getByDomain(params = {}) {
  return api.get(`${ANALYTICS_BASE}/by-domain`, { query: params });
}

export async function getByRegion(params = {}) {
  return api.get(`${ANALYTICS_BASE}/by-region`, { query: params });
}

export async function getBySource(params = {}) {
  return api.get(`${ANALYTICS_BASE}/sources`, { query: params });
}

export async function getByGrade(params = {}) {
  return api.get(`${ANALYTICS_BASE}/by-grade`, { query: params });
}

export async function getSalaryStats(params = {}) {
  return api.get(`${ANALYTICS_BASE}/salary`, { query: params });
}

export async function getDomainGradeMatrix(params = {}) {
  return api.get(`${ANALYTICS_BASE}/domain-grade-matrix`, { query: params });
}
