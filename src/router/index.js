import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../components/page/Login.vue')
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('../components/common/Home.vue'),
            meta: {
                roles: ['admin', 'user'],
                title: '自述文件',
            },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                }
            ]
        }
    ]
});
