import { api } from "@app/api/client";

const AUTH_BASE = "/api/v1/auth";

export async function registerUser(payload) {
  return api.post(`${AUTH_BASE}/register`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loginUser({ email, password }) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  return api.post(`${AUTH_BASE}/login`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

export async function getCurrentUser(token) {
  return api.get(`${AUTH_BASE}/me`, {
    token,
  });
}
