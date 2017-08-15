
import Vue from 'vue';
import App from './components/App.vue';
import RoomView from './components/RoomView.vue';
import Register from './components/Register.vue';
import MapView from './components/MapView.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'room',
    path: '/room/:roomName',
    component: RoomView,
    props: true
  },
  {
    name: 'register',
    path: '/register',
    component: Register
  },
  {
    name: 'map',
    path: '/map/',
    component: MapView,
    props: true
  },
  {
    name: 'map-shard',
    path: '/map/:shard',
    component: MapView,
    props: true
  },
]

const router = new VueRouter({
  routes
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
