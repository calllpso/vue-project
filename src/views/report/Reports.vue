<script setup>
import {onBeforeMount, ref, onBeforeUnmount} from 'vue'
import {ReportsTable} from '@classes/tables'
import Table from '@components/tables/Table.vue';

import router from '@router/index'

import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useSocketStore } from '@/stores/socket'

const socketStore = useSocketStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()

const reportTable = ref(null)

onBeforeMount(async()=>{
    let reportsTableData = await restStore.GET(apiroutesStore.routes.reports.get)
    reportTable.value = new ReportsTable(reportsTableData)
})


function goToChangePage(id){
    router.push({ name: 'reports-detail', params: { id: id } })
}

// socket
socketStore.socket.on("report", (data) => {
    socketInstruction(data)
})
async function socketInstruction(){
    let reportsTableData = await restStore.GET(apiroutesStore.routes.reports.get)
    reportTable.value = new ReportsTable(reportsTableData)
}
onBeforeUnmount(()=>{
    socketStore.socket.off("report")
})

</script>



<template>
    <Table :data="reportTable" 
    :actions="{
        'change': (id)=> goToChangePage(id),
    }"
    />
</template>
