<template>
  <div class="main-layout">
    <left-panel />
    <main class="main-layout__content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import LeftPanel from "@app/layout/LeftPanel.vue";

</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  align-items: stretch;
}

.main-layout__content {
  flex: 1;
  padding: 16px;
  background: radial-gradient(circle at 0% 0%, #f4f8ff 0%, #f7f9fd 45%, #f5f7fb 100%);
}
</style>
