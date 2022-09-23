import VueRouter from "vue-router";
import FindMusic from '../views/FindMusic.vue'
import RecentPlay from '../views/RecentPlay.vue'
import Favourite from '../views/Favourite.vue'
import MusicListPage from '../views/MusicListPage.vue'
import UserCenter from '../views/UserCenter.vue'
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题

export default new VueRouter({
    //7.配置路由信息
    routes: [
        {
            path: '/',
            redirect: '/FindMusic'
        },
        {
            name: 'FindMusic',
            path: '/FindMusic',
            component: FindMusic
        },
        {
            name: 'RecentPlay',
            path: '/RecentPlay',
            component: RecentPlay
        },
        {
            name: 'Favourite',
            path: '/Favourite',
            component: Favourite
        },
        {
            name: 'MusicListPage',
            path: '/MusicListPage',
            component: MusicListPage
        },
        {
            name: 'UserCenter',
            path: '/UserCenter',
            component: UserCenter
        },
    ]
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
