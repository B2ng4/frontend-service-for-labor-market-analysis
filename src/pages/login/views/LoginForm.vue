<template>
  <div class="auth-container">
    <el-card class="auth-card" shadow="hover">
      <div class="auth-header">
        <el-text tag="b" size="large">Вход в систему</el-text>
        <el-text type="info">Используйте email и пароль аккаунта</el-text>
      </div>
      <el-form :model="form" label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="Email">
          <el-input v-model.trim="form.login" autocomplete="username" placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            autocomplete="current-password"
            placeholder="Введите пароль"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button class="auth-submit" type="primary" :loading="loading" @click="onSubmit">
          Войти
        </el-button>
        <el-text class="auth-link" @click="$router.push('/login/register')">
          Нет аккаунта? Регистрация
        </el-text>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginUser, getCurrentUser } from "@app/api/auth";
import { useSessionStore } from "@app/store/useSessionStore";

const router = useRouter();
const session = useSessionStore();
const loading = ref(false);
const form = ref({
  login: "",
  password: "",
});

const onSubmit = async () => {
  if (!form.value.login || !form.value.password) {
    ElMessage.warning("Введите email и пароль");
    return;
  }

  loading.value = true;
  try {
    const tokenData = await loginUser({
      email: form.value.login,
      password: form.value.password,
    });
    session.setToken(tokenData.access_token);

    const me = await getCurrentUser(tokenData.access_token);
    session.setUser(me);

    ElMessage.success("Вход выполнен");
    await router.push("/main/dashboard");
  } catch (error) {
    ElMessage.error(error.message || "Не удалось выполнить вход");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.auth-card {
  width: 420px;
  border-radius: 14px;
}

.auth-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.auth-submit {
  width: 100%;
  margin-top: 6px;
}

.auth-link {
  display: block;
  margin-top: 12px;
  text-align: center;
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>