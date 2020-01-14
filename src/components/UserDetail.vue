<template>
	<div class="user-detail">
		<div class="user-detail-photo">
			<img v-if='user.photo'
				class="user-photo"
				:src='user.photo'
				:alt='user.photo'
			/>
			<div v-else class="user-photo-none">No photo</div>
		</div>
		<div class="user-detail-item">
			<div class="user-detail-label">Username:</div>
			<div class="user-detail-content">{{user.username}}</div>
		</div>
		<div class="user-detail-item">
			<div class="user-detail-label">Email:</div>
			<div class="user-detail-content">{{user.email}}</div>
		</div>
		<div class="user-detail-item">
			<div class="user-detail-label">Date of birth:</div>
			<div class="user-detail-content">
				{{userBirtday}}
				<!-- {{user.birthday}} -->
			</div>
		</div>
		<div class="user-detail-item">
			<div class="user-detail-label">Age:</div>
			<div class="user-detail-content">{{user.age}}</div>
		</div>
		<div class="user-detail-item">
			<div class="user-detail-label">Phone:</div>
			<div class="user-detail-content">{{user.phone}}</div>
		</div>
		<button @click='$router.push({ name: "edit", params: { editUser: user } })'>
			Edit user
		</button>
		<button @click='$emit("user-delete", user._id)'>Delete user</button>
	</div>

</template>

<script>
import { dateToStr } from '../helpers/helpers'

export default {
	name: 'UserDetail',
	props: {
		user: Object
	},
	computed: {
		userBirtday: function() {
			return dateToStr(this.user.birthday)
		}
	}
}
</script>

<style>
.user-detail {
  flex-basis: 80%;
  margin: 0;
  padding: 10px 10px 10px 10px;
  background-color: #f3f3f3;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 18px;
}
.user-detail .user-detail-photo .user-photo {
  width: 200px;
  height: 200px;
}
.user-detail .user-detail-item {
  display: flex;
  flex-wrap: wrap;
}
.user-detail .user-detail-item .user-detail-label {
  min-width: 20%;
  padding: 10px;
  box-sizing: border-box;
  font-weight: 600;
}
.user-detail .user-detail-item .user-detail-content {
  width: 75%;
  padding: 10px;
  box-sizing: border-box;
}
.user-detail button {
  width: 130px;
  padding: 15px;
  margin: 10px;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  background-color: #fff;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  text-transform: uppercase;
}

</style>