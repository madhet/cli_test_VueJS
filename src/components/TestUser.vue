<template>
	<ol>
		<li v-for="user of users" :key="user.id" :class="'user-item' + (user.id === currentUser ? ' active' : '')"  @click="$emit('current-user', user.id)">
			<div>{{ user.username }}</div>
		</li>
	</ol>
</template>

<script>

export default {
	name: 'TestUser',
	props: {
		users: Array,
		currentUser: Number
	}
}
</script>

<style>
.user-item.active {
	background-color: lightblue;
}
</style>
