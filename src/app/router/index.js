import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes.js";
import { useSessionStore } from "@app/store/useSessionStore";

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
  const session = useSessionStore();

  // Восстанавливаем сохраненную сессию перед проверкой доступности маршрута.
  await session.initializeSession();

  // Авторизованному пользователю не нужно повторно открывать страницы входа.
  if (to.path.startsWith("/login") && session.state.token) {
    return "/main/dashboard";
  }

  // Закрытые разделы приложения доступны только при наличии токена.
  if (to.matched.some((record) => record.meta?.requiresAuth) && !session.state.token) {
    return "/login";
  }

  return true;
});