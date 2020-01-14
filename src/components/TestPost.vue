<template>
	<ol v-if="posts.length" class='post-list'>
		<li v-for="post of posts" :key="post.id">
			<div><b>{{ post.title }}</b></div>
			<div>{{ post.body }}</div>
		</li>
	</ol>
	<div v-else>Choose user to see posts</div>
</template>

<script>

export default {
	name: 'TestPost',
	props: {
		posts: Array
	}
}
</script>

<style>
.post-list {
	background-color: lightblue;
}
</style>
