<script setup>
import { onMounted, ref, watch } from 'vue';
import Svg from '@components/Svg.vue';
import Text from '@components/inputs/Text.vue'

const props = defineProps({
    treeData: Array,
    changeFunction: null,
    deleteFunction: null,
})
const emit = defineEmits(['response'])

const searchValue = ref('')
const filteredTree = ref(props.treeData)
const response_division = ref({
    id: null,
    name: null
})



function sendToParent(data){
    response_division.value.id = data.id
    response_division.value.name = data.name
    emit('response', response_division.value)
    if( props.changeFunction != null){
        props.changeFunction(data)
    }
}

function buildHashTable(tree) {
  const hashTable = {}
  function traverseTree(tree) {
    tree.forEach((item) => {
      hashTable[item.id] = item;
      if ( item.children.length > 0) {
        traverseTree(item.children)
      }
    })
  }
  traverseTree(tree);
  return hashTable;
}

function buildNameIdHashTable(tree) {
  const nameIdHashTable = {};
  function traverse(items) {
    items.forEach((item) => {
      nameIdHashTable[item.name.toLowerCase()] = item.id;
      if (item.children.length > 0) {
        traverse(item.children);
      }
    })
  }
  traverse(tree);
  return nameIdHashTable;
}

function keepItemAndParents(tree, searchStr) {
    var itemIds =[]
    if( searchStr.length > 0){
        const namedIdHashTable = buildNameIdHashTable(tree)
        Object.keys(namedIdHashTable).forEach(function (key) {
            if (key.includes(searchStr)){
                itemIds.push(namedIdHashTable[key])
            }
        })
        if (itemIds.length != 0){
            const hashTable = buildHashTable(tree)
            const itemIdsToKeep = []
            for (const i of itemIds) {
                const itemToKeep = hashTable[i]  
                itemToKeep['is-selected']=true
                let parent = hashTable[itemToKeep.parentID]

                // save parents
                while (parent) {
                    itemIdsToKeep.push(parent.id);
                    parent = hashTable[parent.parentID];
                }
                // save children
                function collectChildrenIds(item, itemIdsToKeep) {
                    itemIdsToKeep.push(item.id)
                    for (const child of item.children) {
                        collectChildrenIds(child, itemIdsToKeep)
                    }
                }
                collectChildrenIds(itemToKeep, itemIdsToKeep)
            }
            // filter
            function filterChildren(items) {
                return items.filter((item) => {
                    if (itemIdsToKeep.includes(item.id)) {
                        item.children = filterChildren(item.children) // Recursively filter children
                        return true
                    }
                    return false;
                })
            }
            tree = filterChildren(tree)
            return tree
        }
        else return []
    }
    else return tree
}

watch(searchValue, searchStr =>{
    filteredTree.value = JSON.parse(JSON.stringify(props.treeData)) // deep copieng
    searchStr = searchStr.toLowerCase()
    filteredTree.value = keepItemAndParents(filteredTree.value, searchStr);
})
watch(props, () =>{
  filteredTree.value = props.treeData
})

// html elements
const tree =ref(null)
const input = ref(null)

onMounted(()=>{
  console.log(tree.value)

})

</script>



<template>    
<div class="tree-container">

    <Text class="tree-search" ref="input" placeholder="Быстрый поиск" :value="searchValue" @callback="(val) => searchValue = val"/>

    <a-tree
      :id="'tree'"
      v-if="filteredTree.length>0"
      class="custom-tree"
      :defaultExpandAll="true"
      :tree-data="filteredTree"
      :blockNode="true"
      :selectable="false"
      >
      
        <template v-slot:title="{data}">
          <div class="flex-container">
            <div class="flex-span" @click="sendToParent(data)">
               <span class="title-span"  :is-selected="data['is-selected']"> {{ data.name }} </span>
            </div>
            <div class="flex-btn" v-if="props.changeFunction!=null && props.deleteFunction!=null">
                  <svg class="svg-icon icon_pencil" @click="props.changeFunction(data)" v-if="props.changeFunction!=null"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20.71 7.04006C21.1 6.65006 21.1 6.00006 20.71 5.63006L18.37 3.29006C18 2.90006 17.35 2.90006 16.96 3.29006L15.12 5.12006L18.87 8.87006M3 17.2501V21.0001H6.75L17.81 9.93006L14.06 6.18006L3 17.2501Z"/>
                  </svg>
                
                  <svg class="svg-icon icon_delete" @click="props.deleteFunction(data)" v-if="props.deleteFunction!=null"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"/>
                  </svg>
            </div>
          </div>
        </template>      
    </a-tree>
</div>
</template>
  
<style lang="sass">
@import "@assets/main.sass"
.ant-tree-switcher 
  display: flex
  align-items: center
  width: 1.5rem !important
  // padding: 0 .25rem
.ant-tree-title
  height: 100%
  display: flex
  align-items: center

.tree-search
  border-bottom: 2px solid
  border-color: #0a466a91

.tree-container
  width: max-content
  border-radius: 4px !important
  overflow: hidden
  padding: 1rem
  background: white

.ant-tree-treenode
  border-bottom: 1px solid
  border-color: #425f7045
  padding: 0px !important
  // .ant-tree-node-content-wrapper
    // display: flex
    // align-items: center

.ant-tree-node-content-wrapper-normal
  border-radius: 0px !important
.ant-tree-node-content-wrapper 
  border-radius: 0px !important
  height: 2rem
  vertical-align: center
  padding: 0px !important



.svg-icon
    cursor: pointer
    width: 1.5rem
    &.icon_delete
      fill: #b32828de
    &.icon_pencil
      fill: #0a466a 
.ant-tree

    // padding: 1rem
    font-family: 'Roboto'
    // border-radius: 3rem
    // border-top: 1px solid
    // width: max-content
    width: 100%
.ant-tree-switcher-icon svg
    font-size: 13px     

.custom-tree .ant-tree-node-content-wrapper
    transition: none !important
    &:hover
      background: #97e5f3be


.flex-container
    width: 100%
    display: flex
    cursor: default
    height: min-content
    .flex-span
        margin-right: auto
        width: 100% 
        cursor: pointer
        padding-right: 1rem
        .title-span
            font-size: 1rem
            &[is-selected=true]
                background-color: #97e5f3be
    .flex-btn
        padding-left: 1rem
        display: flex
        gap: 1rem
        .flex-item
            cursor: pointer
            margin-left: 15px  



</style>