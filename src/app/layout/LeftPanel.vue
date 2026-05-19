<template>
  <aside class="layout">
    <div class="layout__logo-wrap">
      <div class="layout__logo">Навык</div>
      <el-text v-if="session.state.user?.email" class="layout__user" size="small">
        {{ session.state.user.email }}
      </el-text>
    </div>

    <div class="layout__nav">
      <div
          v-for="route in routes"
          :key="route.url"
          class="navigation pa-2 cursor-pointer"
          :class="{ 'navigation--active': isActive(route.url) }"
          @click="$router.push(route.url)"
      >
        <el-icon
            :size="22"
            color="white"
        >
          <component :is="route.icon" />
        </el-icon>
        <span class="navigation__label">{{ route.label }}</span>
      </div>
    </div>
    <el-button text class="layout__logout" @click="logout">Выйти</el-button>
  </aside>
</template>

<script setup>
import { Menu, User, Document, Search, Star, Timer, TrendCharts, Grid, Warning } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useSessionStore } from "@app/store/useSessionStore";

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const routes = [
  { url: "/main/dashboard", label: "Дашборд", icon: Menu },
  { url: "/main/profile", label: "Профиль", icon: User },
  { url: "/main/resume", label: "Анализ резюме", icon: Document },
  { url: "/main/vacancies", label: "Поиск вакансий", icon: Search },
  { url: "/main/favorites", label: "Избранное", icon: Star },
  { url: "/main/history", label: "История", icon: Timer },
  { url: "/main/market-tracker", label: "Мониторинг рынка", icon: TrendCharts },
  { url: "/main/hiring-strategy", label: "Стратегия найма", icon: Grid },
  { url: "/main/risk-radar", label: "Радар рисков", icon: Warning },
];

const isActive = (url) => route.path === url || route.path.startsWith(url + "/");

const logout = async () => {
  session.clearSession();
  ElMessage.success("Вы вышли из аккаунта");
  await router.push("/login");
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  width: 220px;
  flex-shrink: 0;
  align-self: stretch;
  box-sizing: border-box;
  padding: 14px 12px;
  background: linear-gradient(180deg, #4e6fa4 0%, #3f5f93 55%, #344d78 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.16);
}

.layout__logo {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 8px 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.layout__logo-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layout__user {
  color: rgba(255, 255, 255, 0.85);
  padding: 0 10px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.layout__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.layout__logout {
  margin-top: auto;
  color: #ffffff;
  justify-content: flex-start;
  width: 100%;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.navigation:hover {
  background-color: rgba(255, 255, 255, 0.16);
  transform: translateX(2px);
}

.navigation--active {
  background-color: rgba(255, 255, 255, 0.28);
}

.navigation__label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}
</style>