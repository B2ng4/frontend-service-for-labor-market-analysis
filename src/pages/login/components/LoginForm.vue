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
                @click="onSubmit"
            >
              Вход
            </el-button>
            <el-text class="cursor-pointer mt-3">Регистрация</el-text>
          </div>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({});

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>