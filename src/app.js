
import Vue from 'vue';
import App from './components/App.vue';
import RoomView from './components/RoomView.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		name: 'room',
		path: '/room/:roomName', 
		component: RoomView, 
		props: true },
]

const router = new VueRouter({
	routes
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});