<script setup>
import Card from '@components/cards/Card.vue'
import GridCard from '@components/base/GridCard.vue'
import {ref, onBeforeMount, onBeforeUnmount} from 'vue'
import {EmployeeForm} from '@classes/forms'
import { useRoute } from 'vue-router'
import {ListTable} from '@classes/tables'
import Table from '@components/tables/Table.vue'
import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useSocketStore } from '@/stores/socket'

const socketStore = useSocketStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const confirmStore = useConfirmStore()

const route = useRoute()

// socket
const employee_data = ref(null)
const divisions_data = ref(null)
const positions_data = ref(null)
const phones_data = ref(null)

const employee_id = route.params.id
const employeeForm = ref(new EmployeeForm())

// callLists
const listTableWithEmployee = ref(null)
const listTableWithoutEmployee = ref(null)

//проверка чтобы убрать добавление в список
function checkRoute(){
    return (route.name == 'employees-update')
}

async function get_callback(){
        let employeeData = employeeForm.value.toAPI_put()
        // update employee
        restStore.PUT(apiroutesStore.routes.employees.put, employeeData.employee)
        restStore.POST(apiroutesStore.routes.phones.post, employeeData.phones)
}

async function excludeLists(calllistIds){
        let data = structureForApi(calllistIds)
        restStore.DELETE_BODY(apiroutesStore.routes.employeeListTable.delete, data)
}

async function includeLists(calllistIds){
        let data = structureForApi(calllistIds)
        restStore.POST(apiroutesStore.routes.employeeListTable.post, data)
}

// не одинаковые с listUpdate.vue
function structureForApi(calllistIds){
    let data = []
    calllistIds.forEach((list_id) => {
      let entry       = {
        id: 0,
        id_employee: employee_id, //const
        id_list: list_id,
        enabled: true
      }
      data.push(entry)
    })
    return data
}
const dialogCallList = ref(false)
function openDialogIncludeLists(){
    dialogCallList.value = !dialogCallList.value
}


onBeforeMount(async()=>{
    employee_data.value = await restStore.GET(apiroutesStore.routes.employees.get(employee_id))
    divisions_data.value = await restStore.GET(apiroutesStore.routes.divisions.base)
    positions_data.value = await restStore.GET(apiroutesStore.routes.positions.base)
    console.log(positions_data.value)
    employeeForm.value.single.position.data = positions_data.value
    employeeForm.value.single.division.data = divisions_data.value
    
    // phones
    phones_data.value = await restStore.GET(apiroutesStore.routes.phones.get_by_emp_id(employee_id))

    employeeForm.value.fromAPI(employee_data.value, phones_data.value)

    // get calllists for employee
    let listsWithEmployeesData = await restStore.GET(apiroutesStore.routes.calllist.getByIdEmployee(employee_id, true))
    listTableWithEmployee.value = new ListTable(listsWithEmployeesData)

    let listTableWithoutEmployeeData = await restStore.GET(apiroutesStore.routes.calllist.getByIdEmployee(employee_id, false))
    listTableWithoutEmployee.value = new ListTable(listTableWithoutEmployeeData)
})


// socket
socketStore.socket.on(`employees${employee_id}`, (data) => {
    socketInstructionEmployee(data)
})
function socketInstructionEmployee(employee){
    employee_data.value = employee
    employeeForm.value.fromAPI(employee_data.value, phones_data.value)
}


socketStore.socket.on(`phones${employee_id}`, (data) => {
    socketInstructionPhones(data)
})
function socketInstructionPhones(phones){
    phones_data.value = phones
    employeeForm.value.fromAPI(employee_data.value, phones_data.value)
}


socketStore.socket.on("divisions", (data) => {
    socketInstructionDivision(data)
})
function socketInstructionDivision(divisions){
    employeeForm.value.single.division.data = divisions
    employeeForm.value.fromAPI(employee_data.value, phones)
}


socketStore.socket.on("positions", (data) => {
    socketInstructionPosition(data)
})
function socketInstructionPosition(positions){
    employeeForm.value.single.position.data = positions
}

// socket
socketStore.socket.on(`employee-inlist`, () => {
    socketInstructionEmployeeInList()
})
async function socketInstructionEmployeeInList(socketInstructionEmployeeInList){
    // get calllists for employee
    console.log('employee in lists')

    let listsWithEmployeesData = await restStore.GET(apiroutesStore.routes.calllist.getByIdEmployee(employee_id, true))
    listTableWithEmployee.value = new ListTable(listsWithEmployeesData)

    let listTableWithoutEmployeeData = await restStore.GET(apiroutesStore.routes.calllist.getByIdEmployee(employee_id, false))
    listTableWithoutEmployee.value = new ListTable(listTableWithoutEmployeeData)
}

onBeforeUnmount(()=>{
    socketStore.socket.off(`phones${employee_id}`)
    socketStore.socket.off(`employees${employee_id}`)
    socketStore.socket.off("divisions")
    socketStore.socket.off("positions")
    
})


</script>

<template>

    
    <GridCard>
        <Card :dataFields="employeeForm"
        :btnApplyName="'Сохранить'"
        @callback="confirmStore.startConfirmFunction(get_callback)"
        ></Card>
        
        <!-- callLists -->
        <Table 
            v-if="checkRoute()"
            preHeaderName="Списки сотрудника"
            :data="listTableWithEmployee" 
            checkboxMode="true"
            :headerButtons="['Исключить списки','Добавить списки']"
            @callback_1="callListIds => confirmStore.startConfirmFunction(excludeLists, callListIds) "
            @callback_2="openDialogIncludeLists"
            />

        <v-dialog
            v-model="dialogCallList"
            max-width="max-content"
        >
            <Table 
                v-if="checkRoute()"
                class="modalTable"
                preHeaderName="Списки без сотрудника"
            
                
                :data="listTableWithoutEmployee" 
                checkboxMode="true"
                :headerButtons="['Добавить']"
                @callback_1="callListIds => confirmStore.startConfirmFunction(includeLists, callListIds)"
                />
                
        </v-dialog>
<!-- listTableWithoutEmployee -->

    </GridCard>
</template>

<style lang="sass" scoped>

</style>


