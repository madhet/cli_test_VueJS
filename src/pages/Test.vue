<template>
	<div class="users-wrapper">
		<TestUser :users=users :currentUser=currentUser @current-user=setCurrentUser />
		<TestPost :posts=currentUserPosts />
	</div>
</template>

<script>
import TestUser from '../components/TestUser'
import TestPost from '../components/TestPost'

export default {
	name: 'users',
	data() {
		return {
			users: null,
			currentUser: 0,
			posts: [],
			currentUserPosts: []
		}
	},
	watch: {
		currentUser: function(newValue) {
			if (!this.posts[newValue - 1].length) {
				fetch("https://jsonplaceholder.typicode.com/posts?userId=" + newValue)
					.then(res => res.json())
					.then(posts => {
						this.posts[newValue - 1] = posts;
						this.currentUserPosts = this.posts[newValue - 1];
					});
			} else {
				this.currentUserPosts = this.posts[newValue - 1];
			}
		}
	},
	methods: {
		setCurrentUser(id) {
			this.currentUser = id
		}
	},
	components: {
		TestUser,
		TestPost
	},
	mounted() {
		fetch("https://jsonplaceholder.typicode.com/users")
		.then(res => res.json())
		.then(users => {
			this.users = users;
			for (let i = 0; i < users.length; i++) {
				this.posts[i] = [];
			}
		});
	}
}
</script>

<style>
.users-wrapper {
	display: flex;
}

</style>