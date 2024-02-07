<script setup>
import {onBeforeMount, onBeforeUnmount, ref} from 'vue'

import {PositionTable} from '@classes/tables'
import {PositionForm} from '@classes/forms'
import Table from '@components/tables/Table.vue'
import Card from '@components/cards/Card.vue'

import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useTopbarStore } from '@/stores/topbar'


const confirmStore = useConfirmStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const topbarStore = useTopbarStore()

topbarStore.setbtnFunction(OpenCreateDialog)


// dialogs
const dialog_create = ref(false)
function OpenCreateDialog(){
    dialog_create.value = !dialog_create.value
}
const dialog_change = ref(false)
async function OpenChangeDialog(id){
    let response = await restStore.GET(apiroutesStore.routes.positions.get(id))
    positionForm_change.value.clear()
    positionForm_change.value.fromAPI(response)
    dialog_change.value = !dialog_change.value
}


// form
const positionForm = ref(new PositionForm())
const positionForm_change = ref(new PositionForm())

// table
const positionsTable = ref(null)
onBeforeMount(async()=>{
    let positionsTableData = await restStore.GET(apiroutesStore.routes.positions.base)
    positionsTable.value = new PositionTable(positionsTableData)
    // FirstInstruction()
})


// REST
async function post_callback(){
    await restStore.POST(apiroutesStore.routes.positions.base, positionForm.value.toAPI_post())
    if(positionForm.value.sendStatus){
        dialog_create.value = false
    }
}
async function put_callback(){
        dialog_change.value = false
        await restStore.PUT(apiroutesStore.routes.positions.base, positionForm_change.value.toAPI_put())
}
async function delete__position(id){
        restStore.DELETE(apiroutesStore.routes.positions.delete(id))
}

// socket
import { useSocketStore } from '@/stores/socket'
const socketStore = useSocketStore()
// socketStore.start()
socketStore.socket.on("positions", (data) => {
    socketInstruction(data)
})
async function socketInstruction(data){
    let positionsTableData = data
    positionsTable.value = new PositionTable(positionsTableData)
}

onBeforeUnmount(()=>{
    socketStore.socket.off("positions")
})

</script>

<template>
    <div class="container-position">
        <Table :data="positionsTable" 
        :actions="{
            'delete': (id)=> confirmStore.startConfirmFunction(delete__position, id),
            'change': (id)=> OpenChangeDialog(id),
        }"
        />
    </div>

    
    <!-- create -->
    <v-dialog
        v-model="dialog_create"
        width="auto"
    >
        <Card class="input-card" :dataFields="positionForm"
            :btnApplyName="'Сохранить'"
            @callback="confirmStore.startConfirmFunction(post_callback)"
        ></Card>
    </v-dialog>

    <!-- change -->
    <v-dialog
        width="auto"
        v-model="dialog_change"
        >
        <Card class="input-card" :dataFields="positionForm_change"
            :btnApplyName="'Сохранить'"
            @callback="confirmStore.startConfirmFunction(put_callback)"
        ></Card>
    </v-dialog>


</template>

<style lang="sass" scoped>
.container-position
    width: 50%
.input-card
    width: 35rem
</style>
