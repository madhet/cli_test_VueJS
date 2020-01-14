<template>
	<div v-if='users' class="user-list-wrapper">
		<button @click='$router.push({ name: "edit", params: { editUser: {} } })'>
			New user
		</button>
			<ul v-if='users.length' class="user-list">
				<li v-for='user of users'
					class='user-list-item'
					:class='{ active: user._id === currentUserId }'
					:key='user._id'
					@click='$emit("set-current-user", user._id)'
				>
					{{user.username}}
				</li>
			</ul>
			<div v-else class="user-list-empty">No users yet</div>
	</div>
	<div v-else>Loading...</div>
</template>

<script>
export default {
	name: 'UserList',
	props: {
		users: Array,
		currentUserId: String
	}
}
</script>

<style>
.user-list-wrapper {
  flex-basis: 20%;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 18px;
  border-right: 1px solid #f3f3f3;
  text-align: center;
}
.user-list-wrapper button {
  font-family: inherit;
  width: 130px;
  padding: 15px;
  margin: 10px auto;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  background-color: #fff;
  outline: none;
  cursor: pointer;
  font-size: 15px;
  text-transform: uppercase;
}
.user-list-wrapper .user-list {
  margin: 0;
  padding: 0px 0px 10px 0px;
  list-style: none;
  text-align: left;
  font-size: 18px;
}
.user-list-wrapper .user-list .user-list-item {
  background-color: none;
  padding: 15px 0px 15px 10px;
  border-top: 1px solid #e3e3e3;
  cursor: pointer;
}
.user-list-wrapper .user-list .user-list-item.active {
  background-color: #f3f3f3;
}

</style>