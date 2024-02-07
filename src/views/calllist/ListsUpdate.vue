<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

import {ListForm, LastReportForm } from '@classes/forms'

import EmployeesUpdate from '@views/employees/EmployeesUpdate.vue'
import {EmployeeTable} from '@classes/tables'
import Table from '@components/tables/Table.vue';
import CardList from '@components/cards/CardList.vue'
import CardLastReport from  '@components/cards/CardLastReport.vue'

import { useRoute } from 'vue-router'
import router from '@router/index'

import { useConfirmStore } from '@/stores/confirm'
import { useSnackbarStore } from '@/stores/snackbar'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useSocketStore } from '@/stores/socket'


const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const snackbarStore = useSnackbarStore()
const confirmStore = useConfirmStore()
const socketStore = useSocketStore()

const route = useRoute()
const list_id = route.params.id

const changeListStatus = ref(false)
const dialog = ref(false)
const dialogEmployee=ref(false)

// calllist 
const listForm = ref(new ListForm())
const listForm__const = ref(null)

const lastReportForm = ref(null)

// employees
const employeesInList_Table = ref(null)
const employeesNotInList_Table = ref(null)

// save list
async function saveList(){
    // тут добавляется смс в list и отправляется 
    let current_config = listForm.value.single.id_configuration.object
    
    // только обзвон
    if(current_config.sms==true) 
    {
        // раньше сообщения не было
        if(listForm__const.value.single.id_message_text.id==null){
            listForm.value.single.id_message_text.id = await restStore.POST(apiroutesStore.routes.sms.post.text, listForm.value.toAPI_post_sms())
        }
        // раньше сообщение было
        else{
            // если сообщения разные
            if(listForm.value.single.id_message_text.value != listForm__const.value.single.id_message_text.value){
                // создаем новое сообщение
                listForm.value.single.id_message_text.id = await restStore.POST(apiroutesStore.routes.sms.post.text, listForm.value.toAPI_post_sms())
            }
        }
    }
    // тут в sms из value получает id
    changeListStatus.value = checkListIsChanged()
    
    if(changeListStatus.value){
        await restStore.PUT(apiroutesStore.routes.calllist.put, listForm.value.toAPI_put(listForm.value.single.id_message_text.id))
    }
    changeListStatus.value = false
    
}

// start call
async function callStart(list_id){
    checkActivePhone()

    
    changeListStatus.value = await checkListIsChanged()
    if(changeListStatus.value==false){
        confirmStore.startConfirmFunction(restStore.GET,apiroutesStore.routes.startCallList.get(list_id))
    }
    else{
        confirmStore.setMessage('Список был изменен но не сохранен. Сохранить и запустить?')
        let confirm = await confirmStore.startConfirmFunction(saveList)

        confirmStore.setDefaultMessage()
        if(confirm){
            restStore.GET(apiroutesStore.routes.startCallList.get(list_id))
        }
    }
}
function stopList(){
    restStore.GET(apiroutesStore.routes.cancelCallList.get(list_id))
    
}

// exlude employees
async function get_callback_employees_del(employeeIds){
        let data = structureForApi(employeeIds)    
        restStore.DELETE_BODY(apiroutesStore.routes.employeeListTable.delete, data)
}

// include employees
async function get_callback_employees_add_execute(employeeIds){
        let data = structureForApi(employeeIds)
        restStore.POST(apiroutesStore.routes.employeeListTable.post, data)
}

function structureForApi(employeeIds){
    let data = []
    employeeIds.forEach((employee_id) => {
      let entry       = {
        id: 0,
        id_employee: employee_id,
        id_list: list_id,   //const
        enabled: true
      }
      data.push(entry)
    })
    return data
}

function deleteNotRequredField__Employees__inlist(employees){
    let data_employees =[]
    employees.forEach(  (item) => {
        data_employees.push(item.employee)
    })
    
    // приведение данных из роута к стандарту
    data_employees.forEach(  (item) => {
        delete item.position_id
        delete item.division_id
        delete item.last_list_id
        item.phones = []
        
        item.telNumbers.forEach( async (telphone) => {
            item.phones.push(telphone.phone)
        })
        delete item.telNumbers
        // array to string
        item.phones = item.phones 
    })
    
    return data_employees
}

function deleteNotRequredField__Employees__notinlist(employees){
    employees.forEach(  (item) => {
        delete item.position_id
        delete item.division_id
        delete item.last_list_id

        item.phones = []
        item.telNumbers.forEach( async (telphone) => {
            item.phones.push(telphone.phone)
        })
        delete item.telNumbers
        // array to string
        item.phones = item.phones 
    })
    return employees
}

// dialogs

function closeDialog(){
    dialog.value = !dialog.value
}

// dialog for include employees 
async function get_callback_employees_add(){
    dialog.value = !dialog.value
}

// dialog Employee
// !!! route.params.id сначала использовался для id_list затем будет для id_employee
function openEmployeeInDialog (employee_id){
    route.params.id = employee_id
    dialogEmployee.value =!dialogEmployee.value
}

// проверка активных номеров у сотрудников
function checkActivePhone(){
    employeesInList_Table.value.tbodyConst.forEach((item)=>{
        if(item.common.phones.length == 0){
            snackbarStore.changeType('warning')
            snackbarStore.message ='Не у всех сотрудников задан телефон'
            snackbarStore.show()
            return false
        }
    })
}

// Предупреждения
function checkListIsChanged(){    
    for(let key in listForm.value.single){

        if(!['id_configuration','id_audio', 'id_message_text'].includes(key)){
            if(listForm.value.single[key].value != listForm__const.value.single[key].value){
                // статус не является полем для сравнения
                if(key != 'status'){    
                    return true
                }
            }       
        }
        if('id_configuration' == key){
            if(listForm.value.single[key].object.id != listForm__const.value.single[key].object.id){
                return true
            }
        }
        if('id_audio' == key){
            if(listForm.value.single.id_configuration.object.voice){
                if(listForm.value.single[key].object !=null){
                    // если до этого аудио не было
                    if(listForm__const.value.single[key].object==null){
                        return true
                    }
                    else{
                        if(listForm.value.single[key].object.id != listForm__const.value.single[key].object.id){
                            return true
                        }
                    }
                }
            }
        }
        if('id_message_text' == key){
            if(listForm.value.single[key].value != listForm__const.value.single[key].value){
                return true
            }
        }
    }
    return false
}


// socket
socketStore.socket.on(`calllist${list_id}`, (data) => {
    socketInstructionCalllist(data.listinfo)
})
async function socketInstructionCalllist(data){
    // получаю callList
    let callList = data

    // запускаю приведение данных к Card
    await listForm.value.fromAPI(callList)
    
    // // получаю сообщение для списка
    if(listForm.value.single.id_configuration.object.sms){
        if(listForm.value.single.id_message_text.id != null){
            listForm.value.single.id_message_text.value = ( await restStore.GET(apiroutesStore.routes.sms.get.text(listForm.value.single.id_message_text.id)) ).message_text
        }
    }
    // не смс
    else{
        listForm.value.clearSms()
    }
    listForm__const.value = JSON.parse(JSON.stringify(listForm.value)) //deep copy   )

    // запрашивать списки сотрудников с учетом новой конфигурации
    // таблица employees которые добавлены в список
    let config_id = listForm.value.single.id_configuration.object.id
    let employees = await restStore.GET(apiroutesStore.routes.employeesCallList.get.in(list_id, config_id)) //!!config_id
    let employeesTableData = deleteNotRequredField__Employees__inlist(employees)
    
    employeesInList_Table.value = new EmployeeTable(employeesTableData)
    
    // таблица employees которых нет в списке
    let employeesNotInList = await restStore.GET(apiroutesStore.routes.employeesCallList.get.notin(list_id))
    let employeesNotInListTableData = deleteNotRequredField__Employees__notinlist(employeesNotInList)
    employeesNotInList_Table.value = new EmployeeTable(employeesNotInListTableData)
}

socketStore.socket.on(`emplisttable${list_id}`, (data) => {
    socketInstructionEmpInList(data.empinlist)
})
async function socketInstructionEmpInList(employees){

    // таблица employees которые добавлены в список
    let employeesTableData = deleteNotRequredField__Employees__inlist(employees)
    employeesInList_Table.value = new EmployeeTable(employeesTableData)


        // // таблица employees которых нет в списке
    let employeesNotInList = await restStore.GET(apiroutesStore.routes.employeesCallList.get.notin(list_id))
    let employeesNotInListTableData = deleteNotRequredField__Employees__notinlist(employeesNotInList)
    employeesNotInList_Table.value = new EmployeeTable(employeesNotInListTableData)   
}

socketStore.socket.on("report", () => {
    socketInstructionReport()
    
})
async function socketInstructionReport(){
    let callList = await restStore.GET(apiroutesStore.routes.calllist.getById(list_id))
    await listForm.value.fromAPI(callList)

}

socketStore.socket.on("audio", (data) => {
    socketInstructionAudio(data)
})

async function socketInstructionAudio(audios){
    listForm.value.single.id_audio.data = audios 
    listForm.value.sortAudioById()
}

onBeforeUnmount(()=>{
    socketStore.socket.off(`calllist${list_id}`)
    socketStore.socket.off(`emplisttable${list_id}`)
    socketStore.socket.off("report") //кнопка остановить меняется после последнего звонка
    socketStore.socket.off("audio")
    
})


onBeforeMount(async()=>{
    // получаю callList
    let callList = await restStore.GET(apiroutesStore.routes.calllist.getById(list_id))
    
    // получаю все аудио и присваиваю к data в callList
    let audios = await restStore.GET(apiroutesStore.routes.audio.base)
    listForm.value.single.id_audio.data = audios
    
    // получаю все configs и присваиваю к data в callList
    let configs = await restStore.GET(apiroutesStore.routes.config.get)
    listForm.value.single.id_configuration.data = configs

    // запускаю приведение данных к Card
    await listForm.value.fromAPI(callList)

    // получаю сообщение для списка
    if(listForm.value.single.id_message_text.id != null){
        //////////////////
        listForm.value.single.id_message_text.value = ( await restStore.GET(apiroutesStore.routes.sms.get.text(listForm.value.single.id_message_text.id)) ).message_text
    }
    // const дляотслеживания изменения без сохранения списка
    listForm__const.value = JSON.parse(JSON.stringify(listForm.value)) //deep copy   )


    // таблица employees которые добавлены в список
    let config_id = listForm.value.single.id_configuration.object.id
    let employees = await restStore.GET(apiroutesStore.routes.employeesCallList.get.in(list_id, config_id)) //!!config_id
    let employeesTableData = deleteNotRequredField__Employees__inlist(employees)
    
    employeesInList_Table.value = new EmployeeTable(employeesTableData)
    
    // таблица employees которых нет в списке
    let employeesNotInList = await restStore.GET(apiroutesStore.routes.employeesCallList.get.notin(list_id))
    let employeesNotInListTableData = deleteNotRequredField__Employees__notinlist(employeesNotInList)
    employeesNotInList_Table.value = new EmployeeTable(employeesNotInListTableData)

    
    
    getLastReportInfo()

})




async function getLastReportInfo(){
    let response = await restStore.GET(apiroutesStore.routes.reports.getByListId(list_id))
    
    lastReportForm.value = (new LastReportForm())
    lastReportForm.value.fromAPI(response)

    // console.log(router.resolve({ name: 'reports-detail', params: { id: lastReportForm.value.service.id }}).fullPath )
}
function goToLastReport(){
    router.push({ name: 'reports-detail', params: { id: lastReportForm.value.service.id } })
}

</script>

<template>
    
    <button @click="router.push({ name: 'reports-detail', params: { id: lastReportForm.service.id } })">test</button> 



    <div class="list-container">
        <CardList :dataFields="listForm"
            :btnApplyName="'Сохранить'"
            :btnStartName="'Запустить'"
            btnStopName="Остановить"
            @callback_1="confirmStore.startConfirmFunction(saveList)"
            @callback_2="callStart"
            @callback_3="confirmStore.startConfirmFunction(stopList)"
            :disabledFields="['audio',]"
        />

        <CardLastReport
            v-if="lastReportForm"
            :dataFields="lastReportForm"
            :href="router.resolve({ name: 'reports-detail', params: { id: lastReportForm.service.id }}).fullPath"
            :clickFunction="goToLastReport"
            />
    </div>

    <div class="table-current-employees">
        
        <Table 
            :data="employeesInList_Table" 
            :headerButtons="['Исключить сотрудников', 'Добавить сотрудников']"
            checkboxMode="true"
            @callback_1="employeeIds =>confirmStore.startConfirmFunction(get_callback_employees_del,employeeIds)"
            @callback_2="get_callback_employees_add()"
            :actions="{
                'change': (id)=> openEmployeeInDialog(id),
            }"
        />
    </div>

    <v-dialog
        v-model="dialog"
        persistent
        no-click-animation
    >   
        <Table 
            closeMode="true"
            :data="employeesNotInList_Table" 
            checkboxMode="true"
            :headerButtons="['Добавить сотрудников']"
            @callback_1="employeeIds => confirmStore.startConfirmFunction(get_callback_employees_add_execute,employeeIds)"
            @callback_close="closeDialog"
        />
    </v-dialog>

    <!-- EmployeesUpdate -->
    <v-dialog
        v-model="dialogEmployee"
        >
            <EmployeesUpdate/>
    </v-dialog>

</template>


<style lang="sass">
.table-current-employees
    margin: 1rem

.list-container
    margin: 1rem
    display: flex
    gap: 3rem
    & > *
        width: 50%

    
    


</style>