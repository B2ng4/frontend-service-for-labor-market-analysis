<template>
  <el-container class="landing-page">
    <!-- Верхняя панель с логотипом и быстрыми переходами. -->
    <el-header class="landing-header">
      <div class="logo">
        <span class="logo-mark">Н</span>
        <span class="logo-text">Навык</span>
      </div>

      <div class="nav-actions">
        <a href="#features">Возможности</a>
        <a href="#analytics">Аналитика</a>
        <el-button text @click="goToLogin">Войти</el-button>
        <el-button type="primary" @click="goToLogin">Начать</el-button>
      </div>
    </el-header>

    <el-main class="landing-main">
      <!-- Первый экран: основное позиционирование сервиса и призыв к действию. -->
      <section class="hero">
        <div class="hero-text">
          <el-tag class="hero-tag" type="primary" effect="light" round>
            Аналитика рынка труда и подбор вакансий
          </el-tag>

          <h1>
            Найдите вакансию, которая действительно подходит вашему опыту
          </h1>

          <p class="hero-subtitle">
            Сервис анализирует резюме, выделяет ключевые навыки, сравнивает их с
            требованиями работодателей и показывает понятные рекомендации для
            карьерного роста.
          </p>

          <div class="hero-actions">
            <el-button type="primary" size="large" @click="goToLogin">
              Подобрать вакансию
            </el-button>
            <el-button size="large" plain @click="goToLogin">
              Загрузить резюме
            </el-button>
          </div>

          <div class="hero-stats">
            <div class="stat-card">
              <strong>95%</strong>
              <span>точность совпадения</span>
            </div>
            <div class="stat-card">
              <strong>20+</strong>
              <span>рекомендаций по резюме</span>
            </div>
            <div class="stat-card">
              <strong>10</strong>
              <span>аналитических метрик</span>
            </div>
          </div>
        </div>

        <!-- Демонстрационная карточка показывает пример результата подбора вакансий. -->
        <div class="hero-visual" id="analytics">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div>
                <span class="eyebrow">Профиль кандидата</span>
                <h3>Middle Data Analyst</h3>
              </div>
              <el-tag type="success" round>готово</el-tag>
            </div>

            <div class="match-score">
              <div>
                <span>Лучшее совпадение</span>
                <strong>95%</strong>
              </div>
              <el-progress :percentage="95" :show-text="false" :stroke-width="10" />
            </div>

            <div class="skill-tags">
              <el-tag v-for="skill in skills" :key="skill" type="info" effect="plain">
                {{ skill }}
              </el-tag>
            </div>

            <div class="vacancy-list">
              <div v-for="vacancy in vacancies" :key="vacancy.title" class="vacancy-row">
                <div>
                  <strong>{{ vacancy.title }}</strong>
                  <span>{{ vacancy.company }}</span>
                </div>
                <el-tag :type="vacancy.type" round>{{ vacancy.match }}%</el-tag>
              </div>
            </div>

            <div class="analytics-strip">
              <div v-for="item in analytics" :key="item.label">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Блок с ключевыми возможностями сервиса. -->
      <section class="features-section" id="features">
        <div class="section-heading">
          <el-tag type="primary" effect="plain" round>Возможности</el-tag>
          <h2>Все необходимое для осознанного поиска работы</h2>
          <p>
            Платформа объединяет анализ резюме, подбор вакансий и обзор рынка в
            одном интерфейсе.
          </p>
        </div>

        <div class="feature-grid">
          <el-card v-for="feature in features" :key="feature.title" shadow="never" class="feature-card">
            <div class="feature-icon">{{ feature.number }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </el-card>
        </div>
      </section>

      <!-- Краткий сценарий работы пользователя с сервисом. -->
      <section class="steps-section">
        <div class="steps-card">
          <div>
            <el-tag type="success" effect="light" round>Быстрый старт</el-tag>
            <h2>От резюме до подходящих вакансий за несколько шагов</h2>
          </div>
          <div class="steps-list">
            <div v-for="step in steps" :key="step.title" class="step-item">
              <span>{{ step.number }}</span>
              <div>
                <strong>{{ step.title }}</strong>
                <p>{{ step.text }}</p>
              </div>
            </div>
          </div>
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

// Данные ниже используются только для демонстрационного наполнения лендинга.
const skills = ["SQL", "Python", "Tableau", "Power BI", "Аналитика"];

const vacancies = [
  { title: "Data Analyst", company: "FinTech Group", match: 95, type: "success" },
  { title: "BI Analyst", company: "Retail Cloud", match: 88, type: "warning" },
  { title: "Product Analyst", company: "HRTech Lab", match: 82, type: "info" },
];

const analytics = [
  { label: "Медиана зарплаты", value: "180 000 ₽" },
  { label: "Спрос на навыки", value: "+24%" },
  { label: "Регион", value: "Москва" },
];

const features = [
  {
    number: "01",
    title: "Анализ резюме",
    text: "Сервис определяет навыки, опыт и сильные стороны кандидата на основе загруженного PDF.",
  },
  {
    number: "02",
    title: "Умные рекомендации",
    text: "Алгоритм подбирает вакансии с учетом профиля, совпадения навыков и ожиданий по зарплате.",
  },
  {
    number: "03",
    title: "Сравнение требований",
    text: "Пользователь видит, какие навыки уже подходят под вакансию, а какие стоит развить.",
  },
  {
    number: "04",
    title: "Рыночная аналитика",
    text: "Дашборд показывает динамику вакансий, грейды, регионы, зарплаты и востребованные навыки.",
  },
];

const steps = [
  {
    number: "1",
    title: "Загрузите резюме",
    text: "Файл обрабатывается на сервере, после чего формируется профиль кандидата.",
  },
  {
    number: "2",
    title: "Получите рекомендации",
    text: "Система покажет список вакансий с процентом соответствия вашему опыту.",
  },
  {
    number: "3",
    title: "Изучите рынок",
    text: "Используйте графики и сравнение навыков, чтобы выбрать подходящее направление развития.",
  },
];

// Все основные кнопки лендинга ведут пользователя к авторизации.
const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
/* Общий контейнер лендинга задает фон и вертикальную структуру страницы. */
.landing-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 12%, rgba(79, 123, 247, 0.18), transparent 32%),
    radial-gradient(circle at 82% 10%, rgba(54, 207, 201, 0.16), transparent 28%),
    linear-gradient(180deg, #f7faff 0%, #ffffff 46%, #f7f9fc 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Шапка остается визуально отделенной от контента за счет полупрозрачного фона. */
.landing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, calc(100% - 48px));
  height: 72px;
  margin: 16px auto 0;
  padding: 0 18px;
  border: 1px solid rgba(220, 228, 241, 0.8);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(43, 65, 112, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #1f2933;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #36cfc9);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.24);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-actions a {
  color: #4b5563;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-actions a:hover {
  color: #2563eb;
}

.landing-main {
  padding: 72px 40px 48px;
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  gap: 56px;
  align-items: center;
  margin-bottom: 86px;
}

/* Основной заголовок сделан крупным, чтобы сразу показать ценность сервиса. */
.hero-text h1 {
  max-width: 640px;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.04em;
  margin: 20px 0 22px;
  color: #0f172a;
  font-weight: 800;
}

.hero-subtitle {
  max-width: 600px;
  color: #526071;
  font-size: 18px;
  line-height: 1.75;
  margin: 0;
}

/* Статистические карточки усиливают доверие к возможностям сервиса. */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 620px;
}

.stat-card {
  padding: 18px;
  border: 1px solid rgba(221, 228, 239, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.stat-card strong {
  display: block;
  color: #1d4ed8;
  font-size: 28px;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-card span {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.35;
}

.hero-tag {
  border-radius: 999px;
  padding-inline: 14px;
}

.hero-visual {
  position: relative;
}

.hero-visual::before {
  content: "";
  position: absolute;
  inset: 34px -26px -26px 46px;
  border-radius: 36px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(54, 207, 201, 0.14));
  transform: rotate(4deg);
}

.dashboard-preview {
  position: relative;
  width: 100%;
  border: 1px solid rgba(218, 226, 240, 0.9);
  border-radius: 32px;
  padding: 26px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 28px 80px rgba(30, 58, 138, 0.16);
  backdrop-filter: blur(18px);
  z-index: 1;
}

/* Визуальный превью-блок имитирует результат анализа профиля кандидата. */
.preview-header,
.match-score > div,
.vacancy-row,
.analytics-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-header {
  gap: 16px;
  margin-bottom: 24px;
}

.preview-header h3 {
  margin: 5px 0 0;
  color: #111827;
  font-size: 24px;
}

.eyebrow {
  color: #7c8aa0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.match-score {
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, #eef5ff, #f7fbff);
}

.match-score span {
  color: #64748b;
  font-size: 14px;
}

.match-score strong {
  color: #1d4ed8;
  font-size: 42px;
  line-height: 1;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}

.vacancy-list {
  display: grid;
  gap: 12px;
}

.vacancy-row {
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #ffffff;
}

.vacancy-row strong,
.vacancy-row span {
  display: block;
}

.vacancy-row strong {
  color: #111827;
  font-size: 13px;
}

.vacancy-row span {
  margin-top: 4px;
  color: #7c8aa0;
  font-size: 12px;
}

.analytics-strip {
  gap: 12px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 22px;
  color: #ffffff;
  background: linear-gradient(135deg, #1d4ed8, #14b8a6);
}

.analytics-strip div {
  min-width: 0;
}

.analytics-strip span,
.analytics-strip strong {
  display: block;
}

.analytics-strip span {
  opacity: 0.78;
  font-size: 11px;
}

.analytics-strip strong {
  margin-top: 5px;
  font-size: 14px;
}

.features-section,
.steps-section {
  margin-bottom: 72px;
}

.section-heading {
  max-width: 680px;
  margin: 0 auto 34px;
  text-align: center;
}

.section-heading h2,
.steps-card h2 {
  margin: 16px 0 12px;
  color: #0f172a;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.section-heading p,
.feature-card p,
.step-item p {
  color: #64748b;
  line-height: 1.65;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.feature-card {
  min-height: 250px;
  border: 1px solid rgba(221, 228, 239, 0.9);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
}

.feature-card :deep(.el-card__body) {
  height: 100%;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 28px;
  border-radius: 16px;
  color: #2563eb;
  font-weight: 700;
  background: #eef5ff;
}

.feature-card h3 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 18px;
}

.feature-card p {
  margin: 0;
  font-size: 14px;
}

.steps-card {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 42px;
  padding: 40px;
  border-radius: 32px;
  background: #0f172a;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.steps-card h2 {
  color: #ffffff;
}

.steps-list {
  display: grid;
  gap: 16px;
}

.step-item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.06);
}

.step-item > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  color: #ffffff;
  font-weight: 700;
  background: rgba(37, 99, 235, 0.82);
}

.step-item strong {
  display: block;
  color: #ffffff;
  margin-bottom: 5px;
}

.step-item p {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
}

.landing-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 22px 12px 28px;
  font-size: 12px;
  color: #94a3b8;
  background: transparent;
}

.footer-separator {
  opacity: 0.6;
}

@media (max-width: 960px) {
  .landing-header {
    width: calc(100% - 32px);
  }

  .landing-main {
    padding-inline: 20px;
    padding-top: 48px;
  }

  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }

  .feature-grid,
  .steps-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .landing-header {
    height: auto;
    padding: 12px;
    align-items: flex-start;
    gap: 12px;
  }

  .landing-main {
    padding-inline: 16px;
    padding-top: 32px;
  }

  .nav-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav-actions a {
    display: none;
  }

  .hero-stats,
  .feature-grid,
  .steps-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard-preview {
    padding: 18px;
    border-radius: 24px;
  }

  .preview-header,
  .analytics-strip {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-visual::before {
    display: none;
  }

  .steps-card {
    padding: 24px;
  }
}
</style>

