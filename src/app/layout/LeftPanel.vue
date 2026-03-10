<template>
  <aside class="layout">
    <div class="layout__logo">Заголовок</div>

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
  </aside>
</template>

<script setup>
import { Menu, User, Document } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

const routes = [
  {
    url: "/main/dashboard",
    label: "Дашборд",
    icon: Menu,
  },
  {
    url: "/main/profile",
    label: "Профиль",
    icon: User,
  },
  {
    url: "/main/resume",
    label: "Анализ резюме",
    icon: Document,
  },
];

const isActive = (url) => route.path === url;
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

.layout__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
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