import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import Login from '../components/Login.vue';
import Registration from "../components/Registration.vue";
import Home from "../components/Home.vue";
import Sauna from "../components/Sauna.vue";
import Profile from "../components/Profile.vue";
import About from "../components/About.vue";
import Contacts from "../components/Contacts.vue";
import SaunaMap from "../components/SaunaMap.vue";
import AdminPanel from "../components/AdminPanel.vue";
import UserManage from "../components/UserManage.vue";
import SaunaManage from "../components/SaunaManage.vue";
import Pay from "../components/Pay.vue";

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
                meta: {
                    requiresAuth: true,
                    title: 'Бани'
                }
            },
            {
                path: 'sauna/:id',
                component: Sauna,
                name: 'sauna',
                meta: {
                    requiresAuth: true,
                    title: 'Сауна'
                }
            },
            {
                path: 'profile',
                component: Profile,
                meta: {
                    requiresAuth: true,
                    title: 'Личный кабинет'
                }
            },

            {
                path: 'adminTools/users',
                component: UserManage,
                meta: {
                    requiresAuth: true,
                    requiresAdmin: true,
                    title: 'Пользователи'
                }
            },

            {
                path: 'adminTools/saunas',
                component: SaunaManage,
                meta: {
                    requiresAuth: true,
                    requiresAdmin: true,
                    title: 'Сауны'
                }
            },

            {
                path: 'contacts',
                component: Contacts,
                meta: {
                    requiresAuth: true,
                    title: 'Контакты'
                }
            },

            {
                path: 'adminTools',
                component: AdminPanel,
                meta: {
                    requiresAuth: true,
                    requiresAdmin: true,
                    title: 'Панель разработчика'
                }
            },

            {
                path: 'payment',
                component: Pay,
                name: 'Pay',
                meta: {
                    requiresAuth: true,
                    title: 'Оплата'
                }
            },

            {
                path: '/sauna/:id/map',
                name: 'saunaOnMap',
                component: SaunaMap,
                meta: {
                    requiresAuth: true,
                    title: 'Карта'
                }
            },

            {
                path: 'about',
                component: About,
                meta: {
                    requiresAuth: true,
                    title: 'О нас'
                }
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            return next({ path: '/login' });
        }

        if (to.matched.some(record => record.meta.requiresAdmin)) {
            const role = localStorage.getItem('role');

            if (role !== 'admin') {
                return next({ path: '/main' });
            }
        }

        return next();
    } else {
        return next();
    }
});

router.afterEach((to) => {
    const defaultTitle = 'Bath';
    document.title = to.meta.title || defaultTitle;
});

export default router;
