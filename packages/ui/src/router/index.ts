import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		redirect: () => '/contracts'
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
		component: () => import(/* webpackChunkName: "contracts" */ '../views/ContractList.vue')
	},
	{
		path: '/contracts/:contractCode',
		name: 'Contract',
		props: route => ({ contractCode: route.params.contractCode }),
		component: () => import(/* webpackChunkName: "contracts" */ '../views/Contract.vue')
	},
	{
		path: '/new-contract',
		name: 'NewContract',
		component: () => import(/* webpackChunkName: "contracts" */ '../views/NewContract.vue')
	},
	{
		path: '/customers',
		name: 'CustomerList',
		component: () => import(/* webpackChunkName: "customers" */ '../views/CustomerList.vue')
	},
	{
		path: '/customers/:customerId',
		name: 'Customer',
		props: route => ({ customerId: parseInt(route.params.customerId) }),
		component: () => import(/* webpackChunkName: "customers" */ '../views/Customer.vue')
	},
	{
		path: '/new-customer',
		name: 'NewCustomer',
		component: () => import(/* webpackChunkName: "customers" */ '../views/NewCustomer.vue')
	},
	{
		path: '/groups',
		name: 'GroupList',
		component: () => import(/* webpackChunkName: "groups" */ '../views/GroupList.vue')
	},
	{
		path: '/groups/:groupId',
		name: 'Group',
		props: route => ({ groupId: parseInt(route.params.groupId) }),
		component: () => import(/* webpackChunkName: "groups" */ '../views/Group.vue')
	},
	{
		path: '/new-group',
		name: 'NewGroup',
		component: () => import(/* webpackChunkName: "groups" */ '../views/NewGroup.vue')
	},
	{
		path: '/users',
		name: 'UserList',
		component: () => import(/* webpackChunkName: "users" */ '../views/UserList.vue')
	},
	{
		path: '/users/:username',
		name: 'User',
		props: true,
		component: () => import(/* webpackChunkName: "users" */ '../views/User.vue')
	},
	{
		path: '/new-user',
		name: 'NewUser',
		component: () => import(/* webpackChunkName: "users" */ '../views/NewUser.vue')
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
