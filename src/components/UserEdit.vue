<template>
	<div class="user-edit-form-wrapper">
		<h2>{{id ? "Edit user" : "Create user"}}</h2>
		<form class="user-edit-form" @submit="$event => $event.preventDefault()">
			<div class="form-photo-wrapper">
				<img
					v-if='photo'
					class="form-photo"
					:src='photo'
					:alt='photo'
				/>
				<div class="form-input-wrapper">
					<div class="form-input-label">Photo:</div>
					<input
						type="file"
						name='photo'
						accept='.jpg, .jpeg, .png'
						@change="checkFileInput($event)"
						ref = 'photoFileInput'
					/>
				</div>
			</div>
			<FormInput
				name="username"
				label="Username (only letters and digits)"
				:isRequired=true
				:value='username'
				@validate-input='checkTextInput'
				:errorMessage='usernameErrorMessage'
				@validate-on-blur='validateOnBlur'
			/>
			<FormInput
				name="email"
				label="Email"
				:isRequired=true
				:value='email'
				@validate-input='checkTextInput'
				:errorMessage='emailErrorMessage'
				@validate-on-blur='validateOnBlur'
			/>
			<FormInput
				name="birthday"
				label="Date of birth (mm/dd/yyyy)"
				:isRequired=true
				:value='birthday'
				@validate-input='checkTextInput'
				:errorMessage='birthdayErrorMessage'
				@validate-on-blur='validateOnBlur'
			/>
			<FormInput
				name="phone"
				label="Phone"
				:isRequired=false
				:value='phone'
				@validate-input='checkTextInput'
				:errorMessage='phoneErrorMessage'
				@validate-on-blur='validateOnBlur'
			/>
		</form>
		<button class="form-submit-button" :disabled='!buttonEnabled' @click='submitForm'>{{id ? "Save" : "Create"}}</button>
		<button class="form-submit-button" @click='$router.push({ name: "users" })'>Cancel</button>
	</div>
</template>

<script>
import request from '../helpers/request'
import { strToDate, dateToStr, checkDate } from '../helpers/helpers'
import FormInput from './FormInput'

export default {
	name: 'UserEdit',
	props: {
		editUser: Object
	},
	data() {
		return {
			id: '',
			username: '',
			email: '',
			birthday: '',
			age: 0,
			photo: '',
			phone: '',
			usernameErrorMessage: '',
			emailErrorMessage: '',
			birthdayErrorMessage: '',
			phoneErrorMessage: '',
			photoValue: ''
		}
	},
	computed: {
		buttonEnabled: function() {
			return this.validateField("username", this.username) &&
				this.validateField("email", this.email) &&
				this.validateField("birthday", this.birthday) &&
				this.validateField("phone", this.phone);
		}
	},
	components: {
		FormInput
	},
	activated() {
		if (this.editUser && this.editUser._id) {
			this.id = this.editUser._id;
			this.username = this.editUser.username;
			this.email = this.editUser.email;
			this.birthday = dateToStr(this.editUser.birthday);
			this.age = this.editUser.age;
			this.photo = this.editUser.photo;
			this.phone = this.editUser.phone;
		}
	},
	deactivated() {
		this.id = '';
		this.username = '';
		this.email = '';
		this.birthday = '';
		this.age = 0;
		this.photo = '';
		this.phone = '';
		this.$refs.photoFileInput.value = ''
	},
	methods: {
		getValidData() {
			return {
				username: /^[0-9a-zA-Z]+$/i,
				email: /^([\w.-]+)@([\w-]+\.)+([\w]{2,})$/i,
				birthday: /^\d{2}\/\d{2}\/\d{4}$/i,
				phone: /^\+?\d+$/i
			}
		},
		calcAge(date) {
			let start = new Date(strToDate(date));
			let now = new Date();
			let age = Math.floor((now - start) / (1000 * 3600 * 24 * 365.25));
			return age;
		},
		validateField(name, value) {
			if (name === "username") {
				if (!value) return false;
				else if (value && value.length < 3) return false;
				else if (value && !this.getValidData()[name].test(value)) return false;
			} else if (name === "email") {
				if (!value) return false;
				else if (value && !this.getValidData()[name].test(value)) return false;
			} else if (name === "birthday") {
				if (!value) return false;
				else if (value && !this.getValidData()[name].test(value)) return false;
				else if (value && !checkDate(value)) return false;
			} else if (name === "phone") {
				if (value && !this.getValidData()[name].test(value)) return false;
			}
			return true;
		},
		checkFileInput(event) {
			// console.log(event)
			if (event.target.type === "file") {
				let value = '';
				let file = event.target.files[0];
				if (event.target.files.length) {
					if (
						!["image/jpg", "image/jpeg", "image/png"].includes(
							file.type
						)
					) {
						alert("Unsupported filetype!");
						event.target.value = "";
						value = "";
					} else if (file.size > 1024 * 1024) {
						alert("File is too big!");
						event.target.value = "";
						value = "";
					} else {
						value = event.target.files[0].name;
					}
				}
				this.photo = value;
			}
		},
		checkTextInput(event) {
			// console.log(event)
			let { name, value } = event.target;
			let errorMessage = "";
			if (name === "username") {
				if (value && !this.getValidData()[name].test(value)) {
					errorMessage = "Username is incorrect";
				}
			} else if (name === "phone") {
				if (value && !this.getValidData()[name].test(value)) {
					errorMessage = "Phone is incorrect";
				}
			}
			this[name] = value,
			this[name + "ErrorMessage"] = errorMessage
		},
		validateOnBlur(event) {
			let { name, value } = event.target;
			// let isValid = true;
			let errorMessage = "";
			if (!this.validateField(name, value)) {
				if (name === "username") {
					errorMessage = "Username is incorrect";
				} else if (name === "email") {
					errorMessage = "Email is incorrect";
				} else if (name === "birthday") {
					errorMessage = "Date is incorrect";
				} else if (name === "phone") {
					errorMessage = "Phone is incorrect";
				}
			}
			this[name + 'ErrorMessage'] = errorMessage;
		},
		submitForm() {
			// event.preventDefault();
			let age = this.calcAge(this.birthday);
			this.age = age;
			let { id, username, email, birthday, photo, phone } = this.$data;
			let method = id ? "PATCH" : "POST";
			let url = `/users${id ? "/" + id : ""}`;
			let bd = strToDate(birthday);
			let resBody = {
				username,
				email,
				birthday: bd,
				age,
				photo,
				phone
			};
			request(url, method, resBody).then(user => {
				this.$router.push({ name: 'users', params: { editUser: user } })
			})
			// request(url, method, resBody).then(user => {
			// 	this.props.setUsers(prevState => {
			// 		if (prevState.findIndex(item => item._id === user._id) === -1) {
			// 			this.props.setCurrentUser("");
			// 			return prevState.concat(user);
			// 		} else {
			// 			return prevState.map(item =>
			// 				item._id === user._id ? user : item
			// 			);
			// 		}
			// 	});
			// });
		}
	}
}
</script>

<style>
.user-edit-form-wrapper {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.user-edit-form-wrapper h2 {
  padding: 5px 10px;
  margin: 5px 0;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.user-edit-form-wrapper .user-edit-form {
  padding: 5px;
  font-size: 18px;
}
.user-edit-form-wrapper .user-edit-form .form-photo-wrapper .form-photo {
  width: 200px;
  height: 200px;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper {
  max-width: 40%;
  padding: 3px 0;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input-label {
  padding: 3px 0;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input-label .span-required {
  color: #f00;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #000;
  outline: none;
  padding: 2px;
  font-family: inherit;
  font-size: inherit;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input.error {
  border: 1px solid #f00;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input.error ~.form-input-error {
  display: block;
  color: #f00;
}
.user-edit-form-wrapper .user-edit-form .form-input-wrapper .form-input-error {
  display: none;
}
.user-edit-form-wrapper .form-submit-button {
  width: 100px;
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
.user-edit-form-wrapper .form-submit-button:first-of-type {
  margin-left: 0;
}

</style>