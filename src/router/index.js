/**
 * Created by superman on 17/2/16.
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import * as types from '../store/types'
import Index from '../views/index/Index.vue'
import Login from '../views/login/login.vue'
import Result from '../views/result/Index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '/',
        meta: {
            requireAuth: true,
        },
        component: Index
    },
    {
        path: '/result',
        name: 'result',
        meta: {
            requireAuth: true,
        },
        component: Result
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
];


// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
})

export default router;
