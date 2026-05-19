<template>
  <div class="container">
    <el-row justify="center">
      <el-card style="width: 400px">
        <el-form :model="form">
          <el-form-item>
            <span class="label">Фио</span>
            <el-input v-model="form.fio"/>
          </el-form-item>
          <el-form-item>
            <span class="label">Ссылка на Вк</span>
            <el-input v-model="form.vkUrl"/>
          </el-form-item>
          <el-form-item>
            <span class="label">Логин</span>
            <el-input v-model="form.login"/>
          </el-form-item>
          <el-form-item>
            <span class="label">Пароль</span>
            <el-input
                v-model="form.password"
                type="password"
                show-password
            />
          </el-form-item>
          <div class="display-flex align-items-center flex-column">
            <el-button
                class="width-50 display-block"
                type="primary"
                :loading="loading"
                @click="onSubmit"
            >
              Регистрация
            </el-button>
            <el-text
                class="cursor-pointer mt-3"
                @click="$router.push('/login')"
            >
              Войти
            </el-text>
          </div>
        </el-form>
      </el-card>
    </el-row>
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
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>