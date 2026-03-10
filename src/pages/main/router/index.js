import MainPage from "@pages/main/MainPage.vue";
import DashboardPage from "@pages/main/views/dashboard/DashboardPage.vue";
import ProfilePage from "@pages/main/views/profile/ProfilePage.vue";
import ResumeAnalysisPage from "@pages/main/views/resume/ResumeAnalysisPage.vue";

export default {
    path: '/main',
    component: MainPage,
    children: [
        {
            path: 'dashboard',
            component: DashboardPage,
        },
        {
            path: 'profile',
            component: ProfilePage,
        },
        {
            path: 'resume',
            component: ResumeAnalysisPage,
        }
    ]
}