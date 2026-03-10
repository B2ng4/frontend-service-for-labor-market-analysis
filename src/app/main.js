import { createApp } from "vue";
import ElementPlus from "element-plus";
import ru from "element-plus/es/locale/lang/ru";

import "@assets/styles/index.css";
import App from "./App.vue";
import { router } from "@app/router";

createApp(App)
    .use(ElementPlus, { locale: ru })
    .use(router)
    .mount("#app");