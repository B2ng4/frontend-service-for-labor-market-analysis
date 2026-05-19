import { apiRequest } from "@app/api/client";

const AUTH_BASE = "/api/v1/auth";

export async function registerUser(payload) {
  return apiRequest(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginUser({ email, password }) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  return apiRequest(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

export async function getCurrentUser(token) {
  return apiRequest(`${AUTH_BASE}/me`, {
    method: "GET",
    token,
  });
}
