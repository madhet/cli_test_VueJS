<template>
	<UserEdit :edit-user='editUser' />
		<!-- <button @click='$router.push({ name: "users", params: { editUser: { name: "name" } } })'>Back</button> -->
</template>

<script>
import UserEdit from '../components/UserEdit'

export default {
	name: 'Edit',
	props: {
		editUser: Object
	},
	components: {
		UserEdit
	},
	mounted() {
		// console.log('route', this.$route)
		// console.log('props', this.$props)
	}
}
</script>

<style>

</style>