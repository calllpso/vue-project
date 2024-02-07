<script setup>
import {onBeforeMount, ref, onBeforeUnmount} from 'vue'

import {EmployeeTable} from '@classes/tables'
import Table from '@components/tables/Table.vue';

import router from '@router/index'
// stores
import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useSocketStore } from '@/stores/socket'
import { useTopbarStore } from '@/stores/topbar'


const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const confirmStore = useConfirmStore()
const socketStore = useSocketStore()
const topbarStore = useTopbarStore()

topbarStore.setbtnFunction(router.push,{ name: 'employees-create'})



const employeeTable = ref(null)

function goToChangePage(id){

    router.push({ name: 'employees-update', params: { id: id } })

}

function deleteNotRequredField__Employees(employees){
    employees.forEach(  (item) => {
        delete item.position_id
        delete item.division_id
        delete item.last_list_id

        item.phones = []
        item.telNumbers.forEach( async (telphone) => {
            item.phones.push(telphone.phone)
        })
        delete item.telNumbers
        item.phones = item.phones
    })
    return employees
}


// socket

socketStore.socket.on("employees", (data) => {
    socketInstruction(data)
})

async function socketInstruction(data){
    let employees = data
    let employeesTableData = deleteNotRequredField__Employees(employees)
    employeeTable.value = new EmployeeTable(employeesTableData)
}


onBeforeUnmount(()=>{
    socketStore.socket.off("employees")
})

onBeforeMount(async()=>{
    let employees = await restStore.GET(apiroutesStore.routes.employeesView.base)
    let employeesTableData = deleteNotRequredField__Employees(employees)
    employeeTable.value = new EmployeeTable(employeesTableData)
})

</script>

<template>
           
            <Table :data="employeeTable" 
                :actions="{
                    'change': (id)=> goToChangePage(id),
                    'delete': (id)=> confirmStore.startConfirmFunction(restStore.DELETE, apiroutesStore.routes.employees.delete(id))
                }"
            />
        
</template>

<style lang="sass" scoped>
</style>
