import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue';
import Login from '../components/Login.vue'
import Registration from "../components/Registration.vue";
import Home from "../components/Home.vue";
import Sauna from "../components/Sauna.vue";
import Profile from "../components/Profile.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                redirect: '/login'
            },
            {
                path: 'main',
                component: Home,
                meta: { title: 'Бани' }
            },
            {
                path: 'sauna/:id',
                name: 'sauna',
                component: Sauna,
                meta: { title: 'Сауна' }
            },
            {
                path: 'profile',
                component: Profile,
                meta: { title: 'Личный кабинет' }
            },
        ]
    },
    {
        path: '/login',
        component: Login,
        meta: { title: 'Авторизация' }
    },
    {
        path: '/registration',
        component: Registration,
        meta: { title: 'Регистрация' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    const defaultTitle = 'Bath'
    document.title = to.meta.title || defaultTitle
})

export default router
