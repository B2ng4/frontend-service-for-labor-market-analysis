<template>
  <div class="auth-container">
    <el-card class="auth-card" shadow="hover">
      <div class="auth-header">
        <el-text tag="b" size="large">Создание аккаунта</el-text>
        <el-text type="info">Поля VK и ФИО необязательные</el-text>
      </div>
      <el-form :model="form" label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="ФИО">
          <el-input v-model.trim="form.fio" placeholder="Иванов Иван Иванович" />
        </el-form-item>
        <el-form-item label="Ссылка на VK / id">
          <el-input v-model.trim="form.vkUrl" placeholder="vk.com/id123456 или 123456" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model.trim="form.login" autocomplete="username" placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            autocomplete="new-password"
            placeholder="Минимум 6 символов"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button class="auth-submit" type="primary" :loading="loading" @click="onSubmit">
          Зарегистрироваться
        </el-button>
        <el-text class="auth-link" @click="$router.push('/login')">
          Уже есть аккаунт? Войти
        </el-text>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { registerUser } from "@app/api/auth";

const router = useRouter();
const loading = ref(false);
const form = ref({
  fio: "",
  vkUrl: "",
  login: "",
  password: "",
});

const parseVkId = (value) => {
  if (!value) return null;
  const normalized = String(value).trim();
  if (!normalized) return null;
  if (/^\d+$/.test(normalized)) return Number(normalized);
  const match = normalized.match(/(?:vk\.com\/id|id)(\d+)/i);
  if (match) return Number(match[1]);
  return null;
};

const onSubmit = async () => {
  if (!form.value.login || !form.value.password) {
    ElMessage.warning("Заполните email и пароль");
    return;
  }

  const vkId = parseVkId(form.value.vkUrl);
  if (form.value.vkUrl && !vkId) {
    ElMessage.warning("VK должен быть в формате id123456 или ссылкой vk.com/id123456");
    return;
  }

  loading.value = true;
  try {
    await registerUser({
      email: form.value.login,
      password: form.value.password,
      full_name: form.value.fio || null,
      vk_id: vkId,
    });
    ElMessage.success("Регистрация успешна, войдите в систему");
    await router.push("/login");
  } catch (error) {
    ElMessage.error(error.message || "Не удалось зарегистрироваться");
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
  width: 460px;
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