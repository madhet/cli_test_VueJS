<template>
	<div v-if='serverError'>No connection to server</div>
	<div v-else class="users-wrapper">
		<UserList
			:users='users'
			:currentUser='currentUserId'
			@set-current-user='setCurrentUser'
		/>
		<UserDetail v-if='currentUserId'
			:user='currentUser'
			@user-delete='userDelete'
		/>
	</div>
</template>

<script>
import request from '../helpers/request'
import UserList from '../components/UserList'
import UserDetail from '../components/UserDetail'

export default {
	name: 'users',
	props: {
		editUser: Object
	},
	data() {
		return {
			serverError: false,
			users: null,
			currentUserId: ''
		}
	},
	computed: {
		currentUser: function() {
			if (this.currentUserId) {
				return this.users.find(user => user._id === this.currentUserId)
			}
			return null;
		}
	},
	methods: {
		setCurrentUser(id) {
			// console.log(id)
			this.currentUserId = id
		},
		userDelete(id) {
			if (id) {
				if (window.confirm("Delete this user?")) {
					request(`/users/${id}`, "DELETE").then(() => {
						this.currentUserId = '';
						this.users = this.users.filter(item => item._id !== id);
						});
				}
			}
		}
	},
	components: {
		UserList,
		UserDetail
	},
	mounted() {
		request("/users")
			.then(users => {
				this.users = users
				this.currentUserId = ''
			})
			.catch(err => {
				if (err.message === "Failed to fetch") {
					this.serverError = true;
				}
			});
	},
	activated() {
		this.setCurrentUser('');
		if (this.editUser && this.users) {
			if (this.users.some(item => item._id === this.editUser._id)) {
				this.users = this.users.map(item => item._id === this.editUser._id ? this.editUser : item);
			} else {
				this.users = this.users.concat(this.editUser);
			}
		}
	}
}
</script>

<style>
.users-wrapper {
  display: flex;
  justify-content: flex-start;
  padding: 0px 10px 10px 10px;
  height: 100vh;
}

</style>