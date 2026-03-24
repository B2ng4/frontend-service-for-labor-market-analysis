<template>
  <el-container class="landing-page">
    <el-header class="landing-header">
      <div class="logo">
        <span class="logo-text">Навык</span>
      </div>

      <div class="nav-actions">
        <el-button text @click="goToLogin">Войти</el-button>
      </div>
    </el-header>

    <el-main class="landing-main">
      <section class="hero">
        <div class="hero-text">
          <h1>
            Умный подбор вакансий
            <span class="accent">для тех, кто ценит время</span>
          </h1>

          <p class="hero-subtitle">
            Современный сервис, который подбирает вакансии под ваш опыт, навыки и
            ожидания по зарплате — без бесконечных списков и лишних откликов.
          </p>

          <div class="hero-actions">
            <el-button type="primary" size="large" @click="goToLogin">
              Найти вакансию
            </el-button>
          </div>

          <div class="hero-meta">
            <span>⏱ Подбор за 3 шага</span>
            <span>🎯 Фильтр по навыкам и зарплате</span>
            <span>📊 Аналитика по рынку</span>
          </div>
        </div>

        <div class="hero-card">
          <el-card class="smart-match-card" shadow="hover">
            <h3>Умный подбор в действии</h3>

            <div class="smart-match-rows">
              <div class="smart-row">
                <span class="label">Ваш профиль</span>
                <span class="value">Middle Data Analyst</span>
              </div>
              <div class="smart-row">
                <span class="label">Ключевые навыки</span>
                <span class="value">SQL · Python · Tableau</span>
              </div>
              <div class="smart-row">
                <span class="label">Ожидаемая зарплата</span>
                <span class="value">от 180 000 ₽</span>
              </div>
            </div>

            <el-divider />

            <div class="smart-match-results">
              <p class="match-title">Подходящие вакансии</p>
              <div class="match-list">
                <el-tag type="success" round>95% совпадение · FinTech</el-tag>
                <el-tag type="warning" round>88% совпадение · Retail</el-tag>
                <el-tag type="info" round>82% совпадение · HRTech</el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </section>

    </el-main>

    <el-footer class="landing-footer">
      <span>© {{ new Date().getFullYear() }} Навык</span>
      <span class="footer-separator">•</span>
      <span>Аналитика рынка труда и умная подборка вакансий</span>
    </el-footer>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #eef5ff 0, #ffffff 45%, #f6f7fb 100%);
  display: flex;
  flex-direction: column;
}

.landing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  border-bottom: 1px solid rgba(235, 238, 245, 0.9);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #1f2933;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.landing-main {
  padding: 48px 40px 32px;
  flex: 1;
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 32px;
  align-items: center;
  margin-bottom: 56px;
}

.hero-text h1 {
  font-size: 36px;
  line-height: 1.2;
  margin: 12px 0 16px;
  color: #111827;
  font-weight: 700;
}

.hero-text .accent {
  display: block;
  color: #2563eb;
}

.hero-subtitle {
  max-width: 520px;
  color: #4b5563;
  font-size: 15px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 24px 0 12px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.hero-meta span {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.06);
}

.hero-tag {
  border-radius: 999px;
}

.hero-card {
  display: flex;
  justify-content: flex-end;
}

.smart-match-card {
  width: 100%;
  max-width: 360px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: none;
}

.smart-match-card h3 {
  margin-bottom: 16px;
}

.smart-match-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.smart-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.smart-row .label {
  color: #6b7280;
}

.smart-row .value {
  font-weight: 500;
  color: #111827;
}

.match-title {
  margin-bottom: 8px;
  font-size: 13px;
  color: #4b5563;
}

.match-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* дополнительно секции лендинга были удалены для упрощения структуры */

.landing-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 16px 12px 20px;
  font-size: 12px;
  color: #9ca3af;
  background: transparent;
}

.footer-separator {
  opacity: 0.6;
}

@media (max-width: 960px) {
  .landing-header {
    padding-inline: 20px;
  }

  .landing-main {
    padding-inline: 20px;
  }

  .hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-card {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .landing-header {
    padding-inline: 16px;
  }

  .landing-main {
    padding-inline: 16px;
    padding-top: 32px;
  }

  .hero-text h1 {
    font-size: 26px;
  }

  .nav-actions {
    gap: 4px;
  }
}
</style>

