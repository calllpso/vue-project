<script setup>
import {onBeforeMount, onUnmounted, ref} from 'vue'
import {CallTable} from '@classes/tables'
import TableWithNestes from '@components/tables/TableWithNestes.vue';
import { useRoute } from 'vue-router'

import CardListReport from '@components/cards/CardListReport.vue'
import {ListReportForm } from '@classes/forms'

import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useTopbarStore } from '@/stores/topbar'
import { useSocketStore } from '@/stores/socket'

const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const socketStore = useSocketStore()
const topbarStore = useTopbarStore()

topbarStore.setbtnFunction(print)


// title
// emits('callback_topBar__title', `Отчет о выполнении спискa оповещения  ${(new Date).toLocaleString('ru-RU', { hour12: false, })}`  )

const route = useRoute()
const report_id = route.params.id

const listReportForm = ref(null)

async function getRunlistInfo(){
    listReportForm.value = (new ListReportForm())

    let dataCalllist = await restStore.GET(apiroutesStore.routes.reports.getById(report_id))
    let config = await restStore.GET(apiroutesStore.routes.config.getById(dataCalllist['run_list_type']))
    listReportForm.value.setConfig(config)

    let audios = await restStore.GET(apiroutesStore.routes.audio.base)
    let audio_result = null
    audios.forEach((audio)=>{
        if(audio.id == dataCalllist['audio_id']){
            audio_result =audio
        }
    })

    listReportForm.value.setAudio(audio_result)    
    listReportForm.value.fromAPI(dataCalllist)
}


const callTable = ref(null)
onBeforeMount(async()=>{
    // call report
    let callTableData = await restStore.GET(apiroutesStore.routes.calls.getById(report_id))
    callTable.value = new CallTable(callTableData)
    
    // list info
    await getRunlistInfo()
})


// socket
socketStore.socket.on("report", (data) => {
    console.log(data)
    socketInstruction(data)
})
async function socketInstruction(data){
    let callTableData = data
    callTable.value = new CallTable(callTableData)

}
onUnmounted(()=>{
    socketStore.socket.off("report")
})

</script>


<template>
    <CardListReport 
        :dataFields="listReportForm"
    ></CardListReport>
    <br>
    
    <TableWithNestes :data="callTable" /> 


    <!-- для печати -->

    <Teleport to="body">
        <div class="container" v-if="listReportForm">
            <div class="info-report"> <b> Отчет о выполнении спискa оповещения №{{listReportForm.single.numlist.value}} по состоянию на {{ (new Date).toLocaleString('ru-RU', { hour12: false, }) }} </b> </div>
            <div class="info-report"> Подтверждено оповещение для {{listReportForm.single.notified.value}} сотрудников</div>
            

            <table class="info-report-calllist-table" v-if="listReportForm">
            <tbody>
                <!-- namelist -->
                    <tr>
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.namelist.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.namelist.value }}
                        </td>
                    </tr>  

                    <!-- configuration  -->
                    <tr>
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.config.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.config.value }}
                        </td>
                    </tr>  

                    <template v-if="listReportForm.single.config.object">
                        <tr v-if="listReportForm.single.config.object.sms">
                            <td class="card-form__col-name"> <div class="td-name"> СМС </div> </td>
                            <td colspan="2">
                                {{ listReportForm.single.id_message_text.value }}                            
                            </td>
                        </tr>
                    </template>  

                    <template v-if="listReportForm.single.config.object">
                        <tr v-if="listReportForm.single.config.object.voice">
                            <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.audio.name }} </div> </td>
                            <td>
                                {{ listReportForm.single.audio.value }}
                            </td>
                        </tr>
                    </template>


                    <!-- run_by  -->
                    <tr>
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.run_by.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.run_by.value }}
                        </td>
                    </tr>  

                    <!-- stop_by  -->
                    <tr v-if="listReportForm.single.stop_by.value">
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.stop_by.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.stop_by.value }}
                        </td>
                    </tr>  

                    <!-- start_time  -->
                    <tr>
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.start_time.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.start_time.value }}
                        </td>
                    </tr>  

                    <!-- end_time  -->
                    <tr>
                        <td class="card-form__col-name"> <div class="td-name"> {{ listReportForm.single.end_time.name }} </div> </td>
                        <td colspan="2">
                            {{ listReportForm.single.end_time.value }}
                        </td>
                    </tr>  

            </tbody>
            </table>
            <TableWithNestes :data="callTable"/>
        </div>
    </Teleport>

    


      

    
</template>

<style lang="sass" scoped>
.info-report
    font-size: 1rem
    padding: .25rem 1rem
    
.info-report-calllist-table
    td
        &:first-child
            width: 10rem

.info-report-calllist
    display: none
@media print
    .info-report
        display: block
    .info-report-calllist-table
        display: block
        padding: .25rem 1rem
</style>
