import Vue from 'vue'
import App from './App.vue'
import VueRouter from '../node_modules/vue-router'
import router from './router'
import store from '../store'
Vue.use(VueRouter)
//element-ui的引用
import {
    Button, Slider, Progress, Card, Input, Autocomplete, Badge, Link, Container, Header, Aside, Main,
    Footer, Menu, Submenu, MenuItem, MenuItemGroup, Tooltip, Carousel, CarouselItem, Row, Col, Table,
    TableColumn, Pagination, Dialog, Form, FormItem, Loading, Upload, Avatar, Empty, Drawer, Popover
} from 'element-ui';
Vue.use(Button)
Vue.use(Slider)
Vue.use(Progress)
Vue.use(Card)
Vue.use(Input)
Vue.use(Autocomplete)
Vue.use(Badge)
Vue.use(Link)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Tooltip)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading)
Vue.use(Upload)
Vue.use(Avatar)
Vue.use(Empty)
Vue.use(Drawer)
Vue.use(Popover)
// import VuePlyr from 'vue-plyr'
// import 'vue-plyr/dist/vue-plyr.css'
Vue.config.productionTip = false


// Vue.use(VuePlyr, {
//     plyr: {}
// })
const vm = new Vue({
    el: '#app',
    render(h) {
        return h(App)
    },
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this
    }
})