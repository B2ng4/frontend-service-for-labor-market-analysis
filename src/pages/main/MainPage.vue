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
  height: 100vh;
  align-items: stretch;
  overflow: hidden;
}

.main-layout__content {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 16px;
  background: #fafafa;
}
</style>
