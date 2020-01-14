<template>
	<ul class="tree-sublist" v-if='tree.hasOwnProperty("length")'>
		<template v-if='tree.length'>
			<MultiListItem v-for='(item, idx) of tree' 
				:key='item.value + idx' 
				:tree='item' 
				:parent='parent'
				:edit-tree='editTree'
			/>
		</template>
		<div class="tree-additem-wrapper">
			<input
				type="text"
				v-model="newItem"
				@keyup='e => { if (newItem && e.keyCode === 13) addItem(parent, newItem) }'
			/>
			<button @click='addItem(parent, newItem)'>Add list</button>
		</div>
	</ul>
	<li v-else-if='tree.value'>
		{{tree.value}}
		<button v-if='parent && parent.sub.length > 1 && parent.sub.indexOf(tree) > 0'
			@click='itemMoveUp(parent, tree)'
		>
			&uarr;
		</button>
		<button v-if='parent && parent.sub.indexOf(tree) < parent.sub.length - 1'
			@click='itemMoveDown(parent, tree)'
		>
			&darr;
		</button>
		<button v-if='tree.hasOwnProperty("sub") && !tree.sub' @click='addSublist(tree)'>+ sublist</button>
		<button v-else @click='removeSublist(tree)'>- sublist</button>
		<button v-if='parent' @click='removeList(parent, tree)'>Remove</button>
		<MultiListItem
			v-if='tree.sub'
			:tree=tree.sub
			:parent=tree
			:edit-tree='editTree'
		/>
	</li>
	<MultiListItem
		v-else-if='tree.hasOwnProperty("value") && tree.sub'
		:tree=tree.sub
		:parent=tree
		:edit-tree='editTree'
	/>
	<div v-else>Unable to create list</div>
</template>

<script>
export default {
	name: 'MultiListItem',
	props: ['tree', 'parent', 'editTree'],
	data() {
		return {
			newItem: ''
		}
	},
	methods: {
		addItem(parent, value) {
			if (value) {
				this.editTree('add-item', parent, value);
				this.newItem = '';
			}
		},
		removeList(parent, item) {
			this.editTree('del-list', parent, item);
		},
		addSublist(parent) {
			this.editTree('add-sub', parent);
		},
		removeSublist(parent) {
			this.editTree('del-sub', parent);
		},
		itemMoveUp(parent, item) {
			this.editTree('move-up', parent, item);
		},
		itemMoveDown(parent, item) {
			this.editTree('move-down', parent, item);
		}
	}
}
</script>

<style>

</style>