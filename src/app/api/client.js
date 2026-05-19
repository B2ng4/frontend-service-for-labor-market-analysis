const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined" && window.location.hostname.endsWith("cloudpub.ru")) {
    return "https://appositely-stellar-raptor.cloudpub.ru";
  }

  return "http://localhost:8000";
};

const API_BASE_URL = resolveApiBaseUrl().replace(/\/+$/, "");

const buildHeaders = (headers = {}, token) => {
  const merged = { ...headers };
  if (token) {
    merged.Authorization = `Bearer ${token}`;
  }
  return merged;
};

export async function apiRequest(path, options = {}) {
  const { token, headers, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: buildHeaders(headers, token),
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detail = typeof payload === "object" && payload?.detail
      ? payload.detail
      : payload || `HTTP ${response.status}`;
    throw new Error(String(detail));
  }

  return payload;
}

export { API_BASE_URL };
