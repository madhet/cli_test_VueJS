<template>
  <div class="tree-wrapper" v-if='serverError'>No connection to server!</div>  
  <div class="tree-wrapper" v-else-if='lists && items'>
    <div class="tree-title">{{title}}</div>
    <ListTreeBranch 
      :list-id='lists[0]._id' 
      :lists='lists' 
      :items='items'
    />
  </div>
  <div class="tree-wrapper" v-else>Loading...</div>  
</template>

<script>
import EventBus from '../helpers/EventBus'
import ListTreeBranch from './ListTreeBranch.vue'
import apiClient from '../helpers/restClient'
import { sortItemsAscending } from '../helpers/helpers'

export default {
	name: 'ListTree',
	components: {
		ListTreeBranch,
	},
	props: {
    title: {
      type: String,
      default: '',
    },
		editUser: Object
	},
	data() {
		return {
			lists: null,
      items: null,
      serverError: false,
		}
  },
  created() {
    EventBus.$on('add-item', this.addItem)
    EventBus.$on('add-list', this.addList)
    EventBus.$on('del-list', this.delList)
    EventBus.$on('del-item', this.delItem)
    EventBus.$on('move-up', this.itemMoveUp)
    EventBus.$on('move-down', this.itemMoveDown)
  },
	mounted() {
    apiClient
      .getLists()
      .then(lists => {
        this.lists = lists;
      })
			.catch(err => {
				if (err.message === "Failed to fetch") {
					this.serverError = true;
				}
			});
    apiClient
      .getItems()
      .then(items => {
        this.items = items;
      })
			.catch(err => {
				if (err.message === "Failed to fetch") {
					this.serverError = true;
				}
			});
  },
  beforeDestroy() {
    EventBus.$off('add-item', this.addItem)
    EventBus.$off('add-list', this.addList)
    EventBus.$off('del-list', this.delList)
    EventBus.$off('del-item', this.delItem)
    EventBus.$off('move-up', this.itemMoveUp)
    EventBus.$off('move-down', this.itemMoveDown)
  },
  methods: {
    async addList(parent) {
      const newList = await apiClient.addList({ parent })
      this.lists = this.lists.concat(newList)
    },
    async addItem(parent, title) {
      const newItem = await apiClient.addItem({ parent, title })
      this.items = this.items.concat(newItem)
    },
    delList(listId) {
      apiClient.delList(listId)
        .then(() => {
          this.items = this.items
            .filter(itm => !itm.ancestors.includes(listId));
          this.lists = this.lists
            .filter(itm => (!itm.ancestors.includes(listId) || itm.parent !== listId));
        });
    },
    delItem(itemId) {
      apiClient.delItem(itemId)
        .then(() => {
          this.lists = this.lists
            .filter(itm => !itm.ancestors.includes(itemId));
          const delItem = this.items.find(itm => itm._id === itemId)
          const chItems = this.items
            .filter(itm => (!itm.ancestors.includes(itemId) && itm._id !== itemId))
            .map(itm => {
              if (itm.itemId === delItem.itemId && itm.order > delItem.order) itm.order -= 1;
              return itm;
            })
          this.items = chItems;
        });
    },
    async itemMoveUp(parent, item) {
      const movedUpSet = this.items
        .filter(itm => itm.parent === parent).sort(sortItemsAscending);
      const movedUpPos = movedUpSet
        .findIndex(itm => itm._id === item);
      const firstUp = await apiClient
        .editItem(movedUpSet[movedUpPos]._id, { order: movedUpSet[movedUpPos].order - 1 })
      const secondUp = await apiClient
        .editItem(movedUpSet[movedUpPos - 1]._id, { order: movedUpSet[movedUpPos - 1].order + 1 })
      // const resultUp = await Promise.all([firstUp, secondUp]);
      this.items = this.items.map(itm => {
        if (itm._id === firstUp._id) {
          return firstUp;
        }
        if (itm._id === secondUp._id) {
          return secondUp;
        }
        return itm;
      })
    },
    async itemMoveDown(parent, item) {
      let movedDownSet = this.items
        .filter(itm => itm.parent === parent).sort(sortItemsAscending);
      let movedDownPos = movedDownSet
        .findIndex(itm => itm._id === item);
      const firstDown = await apiClient
        .editItem(movedDownSet[movedDownPos]._id, { order: movedDownSet[movedDownPos].order + 1 })
      const secondDown = await apiClient
        .editItem(movedDownSet[movedDownPos + 1]._id, { order: movedDownSet[movedDownPos + 1].order - 1 })
      const resultDown = await Promise.all([firstDown, secondDown]);
      this.items = this.items.map(itm => {
        if (itm._id === resultDown[0]._id) {
          return resultDown[0];
        }
        if (itm._id === resultDown[1]._id) {
          return resultDown[1];
        }
        return itm;
      })
    },
  },
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