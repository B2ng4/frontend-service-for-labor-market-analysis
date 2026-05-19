const DEFAULT_API_BASE_URL = "https://appositely-stellar-raptor.cloudpub.ru";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const createQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}${createQueryString(query)}`;
};

const buildHeaders = (headers = {}, token) => {
  const merged = { ...headers };
  if (token) {
    merged.Authorization = `Bearer ${token}`;
  }
  return merged;
};

const parsePayload = async (response) => {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
};

export async function apiRequest(path, options = {}) {
  const { token, headers, query, ...restOptions } = options;
  const response = await fetch(buildUrl(path, query), {
    ...restOptions,
    headers: buildHeaders(headers, token),
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    const detail = typeof payload === "object" && payload?.detail
      ? payload.detail
      : payload || `HTTP ${response.status}`;
    throw new Error(String(detail));
  }

  return payload;
}

export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, options = {}) => apiRequest(path, { ...options, method: "POST" }),
};

export { API_BASE_URL };
