import MainPage from "@pages/main/MainPage.vue";
import DashboardPage from "@pages/main/views/dashboard/DashboardPage.vue";

export default {
    path: '/main',
    component: MainPage,
    children: [
        {
            path: 'dashboard',
            component: DashboardPage,
        }
    ]
}