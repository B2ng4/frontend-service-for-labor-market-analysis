import { createApp } from "vue";
import ElementPlus from "element-plus";
import '@assets/styles/index.css'
import App from "./App.vue";
import {router} from "@app/router/index.js";

createApp(App)
    .use(ElementPlus)
    .use(router)
    .mount("#app");