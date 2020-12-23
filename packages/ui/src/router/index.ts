import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
	},
	{
		path: '/contracts',
		name: 'ContractList',
		component: () => import(/* webpackChunkName: "contractList" */ '../views/ContractList.vue')
	},
	{
		path: '/contracts/:id',
		name: 'Contract',
		component: () => import(/* webpackChunkName: "contract" */ '../views/Contract.vue')
	},
	{
		path: '/404',
		name: 'NotFound',
		component: () => import(/* webpackChunkName: "404" */ '../views/NotFound.vue')
	},
	{
		path: '*',
		name: 'CatchAll',
		redirect: '/404'
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

function useRouter() {
	return router;
}

export { router, useRouter };
