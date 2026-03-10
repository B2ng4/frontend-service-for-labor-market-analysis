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
  background: #fafafa;
}
</style>
