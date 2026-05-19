import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes.js";
import { useSessionStore } from "@app/store/useSessionStore";

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
  const session = useSessionStore();
  await session.initializeSession();

  if (to.path.startsWith("/login") && session.state.token) {
    return "/main/dashboard";
  }

  if (to.matched.some((record) => record.meta?.requiresAuth) && !session.state.token) {
    return "/login";
  }

  return true;
});