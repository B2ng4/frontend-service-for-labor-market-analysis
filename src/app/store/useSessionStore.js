import { reactive } from "vue";
import { getCurrentUser } from "@app/api/auth";

const TOKEN_KEY = "lm_access_token";

const state = reactive({
  token: localStorage.getItem(TOKEN_KEY) || "",
  user: null,
  initialized: false,
});

const persistToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const setToken = (token) => {
  state.token = token || "";
  persistToken(state.token);
};

const setUser = (user) => {
  state.user = user || null;
};

const clearSession = () => {
  setToken("");
  setUser(null);
  state.initialized = true;
};

const initializeSession = async () => {
  if (state.initialized) return;
  if (!state.token) {
    state.initialized = true;
    return;
  }

  try {
    const me = await getCurrentUser(state.token);
    setUser(me);
  } catch (_err) {
    clearSession();
    return;
  }
  state.initialized = true;
};

export function useSessionStore() {
  return {
    state,
    setToken,
    setUser,
    clearSession,
    initializeSession,
  };
}
