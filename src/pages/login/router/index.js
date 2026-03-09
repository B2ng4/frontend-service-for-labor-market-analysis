import LoginPage from "@pages/login/LoginPage.vue";
import LoginForm from "@pages/login/views/LoginForm.vue";
import RegisterForm from "@pages/login/views/RegisterForm.vue";

export default {
    path: '/login',
    component: LoginPage,
    children: [
        {
            path: '',
            component: LoginForm
        },
        {
            path: 'register',
            component: RegisterForm
        }
    ]
};