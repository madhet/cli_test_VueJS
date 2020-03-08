<template>
	<div id="app">
		<nav class='main-menu'>
			<router-link to="/test">Test</router-link>
			<router-link to="/users">Users Backend</router-link>
			<router-link to="/list-local">Nested List Local</router-link>
			<router-link to="/list-server">Nested List Backend</router-link>
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
import ListLocal from './pages/ListLocal'
import ListServer from './pages/ListServer'
import Edit from './pages/Edit'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Test },
	{ path: '/test', component: Test },
	{ path: '/users', name: 'users', component: Users, props: true },
	{ path: '/edit', name: 'edit', component: Edit, props: true },
	{ path: '/list-local', component: ListLocal },
	{ path: '/list-server', component: ListServer },
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
