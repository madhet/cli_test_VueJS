<template>
  <ul class="tree-sublist">
    <ListTreeNode
      v-for='item of listItems'
      :key='item._id'
      :item='item'
      :last-order='listItems.length - 1'
      :lists='lists' 
      :items='items'
    />
    <div class="tree-additem-wrapper">
      <input type='text' v-model='itemTitle' @keyup='inputKeyUp($event, listId)' />
      <button @click='addListItem(listId)'>Add item</button>
    </div>
  </ul>
</template>

<script>
import EventBus from '../helpers/EventBus'
import ListTreeNode from './ListTreeNode.vue'
import { sortItemsAscending } from '../helpers/helpers'

export default {
  name: 'ListTreeBranch',
  components: {
    ListTreeNode,
  },
  props: {
    listId: String,
    lists: Array,
    items: Array,
  },
  data() {
    return {
      itemTitle: '',
    }
  },
  computed: {
    listItems: function() {
      return this.items
        .filter(item => item.parent === this.listId)
        .sort(sortItemsAscending)
    }
  },
  methods: {
    addListItem(listId) {
      if (this.itemTitle) {
        EventBus.$emit('add-item', listId, this.itemTitle)
        this.itemTitle='';
      }
    },
    inputKeyUp($event, listId) {
      if ($event.key === 'Enter') {
        this.addListItem(listId);
      }
    },
  },
}
</script>

<style>

</style>