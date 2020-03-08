<template>
  <li>
    {{item.title}}
    <button 
      v-if='item.order' 
      @click='itemMoveUp(item.parent, item._id)'
    >
      &uarr;
    </button>
    <button 
      v-if='item.order < lastOrder'
      @click='itemMoveDown(item.parent, item._id)'
    >
      &darr;
    </button>
    <button 
      v-if='subList.length > 0'
      @click='delSublist(item._id)'
    >
      - sublist
    </button>
    <button 
      v-else
      @click='addSublist(item._id)'
    >
      + sublist
    </button>
    <button 
      v-if='item.parent'
      @click='delItem(item._id)'
    >
      Remove
    </button>
    <ListTreeBranch
      v-if='subList.length'
      :list-id='subList[0]._id'
      :lists='lists' 
      :items='items'
    />
  </li>  
</template>

<script>
import EventBus from '../helpers/EventBus'
import ListTreeBranch from './ListTreeBranch.vue'

export default {
  name: 'ListTreeNode',
  components: {
    ListTreeBranch,
  },
  props: {
    item: Object,
    lastOrder: Number,
    lists: Array,
    items: Array,
  },
  data() {
    return {
      itemTitle: '',
    }
  },
  computed: {
    subList: function() {
      return this.lists
        .filter(list => list.parent === this.item._id);
    },
  },
  methods: {
    addSublist(itemId) {
      EventBus.$emit("add-list", itemId);
    },
    delSublist(itemId) {
      EventBus.$emit("del-list", itemId);
    },
    delItem(itemId) {
      EventBus.$emit("del-item", itemId);
    },
    itemMoveUp(parent, item) {
      EventBus.$emit("move-up", parent, item);
    },
    itemMoveDown(parent, item) {
      EventBus.$emit("move-down", parent, item);
    },
  },
}
</script>

<style>

</style>