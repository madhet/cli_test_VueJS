<template>
	<div id="app">
		<nav class='main-menu'>
			<router-link to="/test">Test</router-link>
			<router-link to="/users">Users</router-link>
			<router-link to="/list">List</router-link>
		</nav>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from './pages/Test'
import Users from './pages/Users'
import List from './pages/List'
import Edit from './pages/Edit'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Test },
	{ path: '/test', component: Test },
	{ path: '/users', name: 'users', component: Users, props: true },
	{ path: '/edit', name: 'edit', component: Edit, props: true },
	{ path: '/list', component: List }
]

const router = new VueRouter({
	routes
})

export default {
	name: 'app',
	router
}
</script>

<style>
.main-menu {
	display: flex;
	justify-content: flex-start
}
.main-menu > a {
	margin: 0px 10px
}
</style>
