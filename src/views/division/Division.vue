<script setup>
import Card from '@components/cards/Card.vue'
import {DivisionForm} from '@classes/forms'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import TreeTable from '@components/tables/TreeTable.vue'

import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useTopbarStore } from '@/stores/topbar'
import { useSocketStore } from '@/stores/socket'


const confirmStore = useConfirmStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const socketStore = useSocketStore()
const topbarStore = useTopbarStore()

topbarStore.setbtnFunction(OpenDialog)


// Division Create
const divisionForm = ref(new DivisionForm())
const divisions = ref(null)
const dialog = ref(false)

function OpenDialog(){
    dialog.value = !dialog.value
}

async function post_callback(){

    await restStore.POST(apiroutesStore.routes.divisions.base, divisionForm.value.toAPI_post())
    if(divisionForm.value.sendStatus){
        dialog.value = false
    }
}




onBeforeMount(async()=>{
    divisions.value = await restStore.GET(apiroutesStore.routes.divisions.base)
    let nullDivision = { id: null, division: '---', parent_id: null }
    divisions.value.unshift(nullDivision)
    divisionForm.value.single.parents.data = divisions.value
    
    // tree
    items.value.treeData = await restStore.GET(apiroutesStore.routes.divisions.tree)
    
    // define parents data
    divisionFormChange.value.single.parents.data = divisions.value
})
//\\

// tree
const items  = ref({
  treeData: [],
  all_divisions: [],
  individual_divisions: [],  
})


// put
const dialogChange = ref(false)
const divisionFormChange = ref(new DivisionForm())

async function OpenDialogChange(division_id){
    let response = await restStore.GET(apiroutesStore.routes.divisions.get(division_id))
    
    divisionFormChange.value.clear()
    divisionFormChange.value.fromAPI(response)
    dialogChange.value = !dialogChange.value
}

async function put_callback(){
        dialogChange.value = false
        await restStore.PUT(apiroutesStore.routes.divisions.base, divisionFormChange.value.toAPI_put())
}



// socket
socketStore.socket.on("divisions", (data) => {
    console.log(data)
    socketInstructionDivision(data)
})

socketStore.socket.on("divisions-tree", (data) => {
    console.log(data)
    socketInstructionDivisionTree(data)
})

async function socketInstructionDivision(data){
    divisions.value = data
    let nullDivision = { id: null, division: '---', parent_id: null }
    divisions.value.unshift(nullDivision)
    divisionForm.value.single.parents.data = divisions.value
    
    divisionFormChange.value.single.parents.data = divisions.value
}
async function socketInstructionDivisionTree(data){
    items.value.treeData = data
}

onBeforeUnmount(()=>{
    socketStore.socket.off("divisions")
    socketStore.socket.off("divisions-tree")
})

</script>

<template>



    <TreeTable
    :treeData="items.treeData"
    :deleteFunction="(item) => confirmStore.startConfirmFunction(restStore.DELETE, apiroutesStore.routes.divisions.delete(item.id)) "
    :changeFunction="(item) => OpenDialogChange(item.id)"
    >
    </TreeTable>

<!-- create -->
<v-dialog
    v-model="dialog"
    width="auto"
    >
    <Card class="input-card" :dataFields="divisionForm"
    :btnApplyName="'Сохранить'"
    @callback="confirmStore.startConfirmFunction(post_callback)"
    ></Card>

</v-dialog>

<!-- change -->
<v-dialog
    width="auto"
    v-model="dialogChange"
      >
      <Card class="input-card" :dataFields="divisionFormChange"
        :btnApplyName="'Сохранить'"
        @callback="confirmStore.startConfirmFunction(put_callback)"
    ></Card>
</v-dialog>


</template>

<style lang="sass" scoped>
$autocomplete-line-height: 10px

.input-card
    width: 35rem


    

</style>
