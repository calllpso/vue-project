<script setup>
import {AudioTable} from '@classes/tables'
import {onBeforeMount, onBeforeUnmount, ref} from 'vue'
import Table from '@components/tables/Table.vue'
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

topbarStore.setbtnFunction(router.push,{ name: 'audio-create'})

// table
const audioTable = ref(null)

function goToChangePage(id){ 
    router.push({ name: 'audio-update', params: { id: id } })
}

// socket
socketStore.socket.on("audio", (data) => {
    socketInstruction(data)
})

async function socketInstruction(data){
    let audioTableData = data
    audioTable.value = new AudioTable(audioTableData)
}

onBeforeUnmount(()=>{
    socketStore.socket.off("audio")
})

onBeforeMount(async()=>{
    let audioTableData = await restStore.GET(apiroutesStore.routes.audio.base)
    audioTable.value = new AudioTable(audioTableData)
})

</script>


<template>
            <Table :data="audioTable" 
            :actions="{
                'delete': (id)=> confirmStore.startConfirmFunction(restStore.DELETE, apiroutesStore.routes.audio.delete(id)),
                'change': (id)=> goToChangePage(id),
            }"
        />


</template>


<style lang="sass" scoped>
.container
    box-sizing: border-box
    padding: 1rem
    width: 100%
    display: flex
    
</style>