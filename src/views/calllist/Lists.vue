<script setup>
import {onBeforeMount, onBeforeUnmount, ref} from 'vue'
import Table from '@components/tables/Table.vue'
import {ListTable} from '@classes/tables'
import router from '@router/index'

import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useTopbarStore } from '@/stores/topbar'
import { useSocketStore } from '@/stores/socket'

const socketStore = useSocketStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const confirmStore = useConfirmStore()
const topbarStore = useTopbarStore()

topbarStore.setbtnFunction(router.push,{ name: 'lists-create'})

const listTable = ref(null)

function goToChangePage(id){
    router.push({ name: 'lists-update', params: { id: id } })
}

// socket
socketStore.socket.on("calllist", (data) => {
    socketInstruction(data.listinfo)
})

async function socketInstruction(data){
    listTable.value = new ListTable(data)
}

onBeforeUnmount(()=>{
    socketStore.socket.off("calllist")
})

onBeforeMount(async()=>{    
    let listTableData = await restStore.GET(apiroutesStore.routes.calllist.get)
    listTable.value = new ListTable(listTableData)
})
</script>

<template>
    <Table :data="listTable" 
        :actions="{
            'delete': (id)=> confirmStore.startConfirmFunction(restStore.DELETE, apiroutesStore.routes.calllist.delete(id)),
            'change': (id)=> goToChangePage(id),
        }"
    />

</template>