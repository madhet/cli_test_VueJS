<template>
	<div class="tree-wrapper">
		<div v-if='title' class="tree-title">{{title}}</div>
		<MultiListItem :tree='tree' :edit-tree='editTree'/>
	</div>
</template>

<script>
import MultiListItem from './MultiListItem'

class TreeList {
	constructor(value = null, sub = null) {
		this.value = value;
		this.sub = sub;
	}
	addSub() {
		this.sub = [];
	}
	delSub() {
		this.sub = null;
	}
	addValue(value) {
		if (!this.sub) this.addSub();
		this.sub.push(new TreeList(value));
	}
	delValue(value) {
		this.sub = this.sub.filter(item => item.value !== value.value);
	}
	moveUp(value) {
		let elem = this.sub.filter(item => item.value === value)[0];
		let pos = this.sub.indexOf(elem);
		if (pos === 0) return;
		this.sub.splice(pos - 1, 2, elem, this.sub[pos - 1]);
	}
	moveDown(value) {
		let elem = this.sub.filter(item => item.value === value)[0];
		let pos = this.sub.indexOf(elem);
		if (pos === this.sub.length - 1) return;
		this.sub.splice(pos, 2, this.sub[pos + 1], elem);
	}
	hasNode(node) {
		if (this === node) {
			return true;
		}
		if (this.sub && this.sub.length) {
			if (this.sub.some(item => item.hasNode(node))) {
				return true;
			}
		}
		return false;
	}
	getNode(node) {
		if (this === node) {
			return this;
		}
		if (this.sub && this.sub.length) {
			let temp = this.sub.filter(item => item.getNode(node));
			if (temp.length) {
				return temp[0].getNode(node);
			}
		}
		return null;
	}
}

let someTree = new TreeList("", []); //create root node
someTree.addValue("List_1");
someTree.sub[0].addSub();
someTree.sub[0].addValue("List_1-1");
someTree.sub[0].addValue("List_1-2");
someTree.sub[0].sub[1].addValue("List_1-2-1");
someTree.sub[0].sub[1].addValue("List_1-2-2");
someTree.sub[0].addValue("List_1-3");
someTree.sub[0].addValue("List_1-4");

export default {
	name: 'MultiList',
	props: {
		title: String
	},
	data() {
		return {
			tree: new TreeList('', [])
			// tree: someTree
		}
	},
	components: {
		MultiListItem
	},
	methods: {
		editTree(action, parent, item) {
			if (action === 'add-item') {
				this.tree.getNode(parent).addValue(item);
			} else if (action === 'add-sub') {
				this.tree.getNode(parent).addSub();
			} else if (action === 'del-sub') {
				this.tree.getNode(parent).delSub();
			} else if (action === 'del-list') {
				this.tree.getNode(parent).delValue(item);
			} else if (action === 'move-up') {
				this.tree.getNode(parent).moveUp(item.value);
			} else if (action === 'move-down') {
				this.tree.getNode(parent).moveDown(item.value);
			}
		}
	}
}
</script>

<style>
.tree-wrapper {
  padding: 10px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.tree-wrapper .tree-title {
  font-size: 20px;
  font-weight: 600;
}
.tree-wrapper ul {
  margin: 0;
  padding: 1px 0px 1px 25px;
  list-style: none;
  font-size: 18px;
}
.tree-wrapper ul li {
  padding: 2px 0;
}
.tree-wrapper ul button {
  margin: 0 2px;
  font-family: inherit;
  font-size: 16px;
  text-transform: uppercase;
}
.tree-wrapper ul input {
  font-family: inherit;
  font-size: 16px;
  outline: none;
}

</style>