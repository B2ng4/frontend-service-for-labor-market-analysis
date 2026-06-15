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
    <el-button class="layout__logout" :icon="SwitchButton" @click="logout">
      Выйти
    </el-button>
  </aside>
</template>

<script setup>
import { Menu, User, Document, Search, Star, Timer, SwitchButton } from "@element-plus/icons-vue";
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
  position: sticky;
  top: 0;
  height: 100vh;
  width: 220px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-self: stretch;
  box-sizing: border-box;
  padding: 14px 12px;
  background: linear-gradient(180deg, #4e6fa4 0%, #3f5f93 55%, #344d78 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.16);
  overflow: hidden;
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
  flex: 1;
  min-height: 0;
  gap: 8px;
  margin-top: 16px;
  padding-bottom: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.layout__nav::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.layout__logout {
  margin-top: auto;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 10px;
}

.layout__logout:hover,
.layout__logout:focus {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.36);
}

.layout__logout:active {
  background: rgba(255, 255, 255, 0.28);
}

.layout__logout :deep(.el-icon),
.layout__logout :deep(span) {
  color: #ffffff;
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

