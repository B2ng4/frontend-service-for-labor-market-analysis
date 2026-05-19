<template>
  <div class="container">
    <el-row justify="center">
      <el-card style="width: 400px">
        <el-form :model="form">
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
              Вход
            </el-button>
            <el-text
                class="cursor-pointer mt-3"
                @click="$router.push('/login/register')"
            >
              Регистрация
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
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>