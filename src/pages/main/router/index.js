import MainPage from "@pages/main/MainPage.vue";
import DashboardPage from "@pages/main/views/dashboard/DashboardPage.vue";
import ProfilePage from "@pages/main/views/profile/ProfilePage.vue";
import ResumeAnalysisPage from "@pages/main/views/resume/ResumeAnalysisPage.vue";
import VacanciesSearchPage from "@pages/main/views/vacancies/VacanciesSearchPage.vue";
import FavoritesPage from "@pages/main/views/favorites/FavoritesPage.vue";
import ViewedHistoryPage from "@pages/main/views/history/ViewedHistoryPage.vue";
import ResumeVsVacancyPage from "@pages/main/views/compare/ResumeVsVacancyPage.vue";

export default {
    path: '/main',
    component: MainPage,
    children: [
        { path: 'dashboard', component: DashboardPage },
        { path: 'profile', component: ProfilePage },
        { path: 'resume', component: ResumeAnalysisPage },
        { path: 'vacancies', component: VacanciesSearchPage },
        { path: 'favorites', component: FavoritesPage },
        { path: 'history', component: ViewedHistoryPage },
        { path: 'compare', component: ResumeVsVacancyPage },
    ]
}