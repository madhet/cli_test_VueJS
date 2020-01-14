<template>
			<div class="form-input-wrapper">
				<div class="form-input-label">
					{{label + ': '}}
					<span v-if='isRequired' class="span-required">*</span>
				</div>
				<input
					type='text'
					class='form-input'
					:class='{ error: errorMessage }'
					:name='name'
					:required='isRequired'
					:value='value'
					@input='$emit("validate-input", $event)'
					@blur='$emit("validate-on-blur", $event)'
				/>
				<div class="form-input-error">{{errorMessage}}</div>
			</div>
</template>

<script>
export default {
	name: 'FormInput',
	props: {
		name: String,
		label: String,
		isRequired: Boolean,
		errorMessage: String,
		value: String
	}

}
</script>

<style>

</style>