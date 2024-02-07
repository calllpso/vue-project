<script setup>
// value such field of json
import Btn from '@components/buttons/Btn.vue'
import Text from '@components/inputs/Text.vue'
import SliderRadio from '@components/inputs/SliderRadio.vue'
import Svg from '@components/Svg.vue'
import { ref,toRaw, watch } from 'vue'
import Autocomplete from '@components/inputs/Autocomplete.vue'
import Tooltip  from '@components/tooltips/Tooltip.vue';
import TextArea from '@components/inputs/TextArea.vue'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()

const props = defineProps({
    dataFields: null,
    btnApplyName: String,
    btnStartName: String,
    btnStopName: String,
})


const localData = ref(props.dataFields);


// getting audio
const audioFile = ref(null)

const configAudio = ref(false)
// sms
const configSms = ref(false)

// против постоянных запросов audio если что-то поменяется в localData
const previewAudioId = ref(null)


watch(
    () => props.dataFields,
    async (newLocalData) => {
        localData.value = newLocalData
        if(newLocalData.single.config.object)
        {
            configAudio.value = newLocalData.single.config.object.voice
//             // sms
            configSms.value = newLocalData.single.config.object.sms
//             // только если есть звонок

            if(newLocalData.single.config.object.voice){

//                 // debug
                if(newLocalData.single.audio.id != null){
                    let audio = (await restStore.GETFILE(apiroutesStore.routes.audio.get(newLocalData.single.audio.id)))
                    audioFile.value = audio.file
                    
                }
            }
        }
}, { deep: true }
)


</script>

<template>
    
<div class="card-form" v-if="localData" >
    <table class="card-form__table">
        <thead class="thead">
            <tr>
                <td></td>
                <td colspan="2">{{localData.head.text}} <br> Подтверждено оповещение для {{ localData.single.notified.value }} сотрудников</td>
            </tr>
            <!-- <tr>
                <td></td>
                <td colspan="2"> Подтверждено {{localData.single.notified.value}} </td>
            </tr> -->

        </thead>
        <tbody>
            <!-- numlist -->
                <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.numlist.name }} </div> </td>
                    <td colspan="2">

                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.numlist.value"
                                />
                    </td>
                </tr>  
            <!-- namelist -->
                <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.namelist.name }} </div> </td>
                    <td colspan="2">

                            
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.namelist.value"
                            />
                    </td>
                </tr>  
                <!-- status -->

                <!-- configuration  -->
                <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.config.name }} </div> </td>
                    <td colspan="2">
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.config.value"
                            />
                    </td>
                </tr>  
                <!-- {{ localData.single.config.object.voice }} -->


                <!-- audio  -->
                
                <tr v-if="configAudio">
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.audio.name }} </div> </td>
                    <td >
                            <Text
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.audio.value" 
                                /> 
                    </td>
                    <td></td>
                </tr>  
                <!-- audio player  -->
                <tr v-if="audioFile!=null && configAudio">
                    <td class="card-form__col-name"> <div class="td-name"> Аудио файл </div> </td>
                    <td colspan="2">
                            <audio 
                                    class="audio" 
                                    controls 
                                    :src="audioFile"

                                    type="audio/mpeg"
                                ></audio>
                    </td>
                </tr>  


                <tr v-if="configSms">
                    <td class="card-form__col-name"> <div class="td-name"> СМС </div> </td>
                    <td colspan="2">
                        
                        <TextArea 
                            :value="localData.single.id_message_text.value" 
                            @callback="(val)=> localData.single.id_message_text.value=val"
                            :cssStyle="localData.single.id_message_text.cssClass"
                            :disabled="true"
                        ></TextArea>
                    </td>
                </tr>


                 <!-- run_by  -->
                 <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.run_by.name }} </div> </td>
                    <td colspan="2">
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.run_by.value"
                            />
                    </td>
                </tr>  

                <!-- stop_by  -->
                <tr v-if="localData.single.stop_by.value">
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.stop_by.name }} </div> </td>
                    <td colspan="2">
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.stop_by.value"
                            />
                    </td>
                </tr>  

                 <!-- start_time  -->
                 <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.start_time.name }} </div> </td>
                    <td colspan="2">
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.start_time.value"
                            />
                    </td>
                </tr> 

                <!-- end_time  -->
                <tr>
                    <td class="card-form__col-name"> <div class="td-name"> {{ localData.single.end_time.name }} </div> </td>
                    <td colspan="2">
                            <Text  
                                :disabled="true"
                                type = "text" 
                                :value="localData.single.end_time.value"
                            />
                    </td>
                </tr> 
                
                

        </tbody>
    </table>
</div>
</template>


<style lang="sass">
@import '@assets/main'

.thead
    color: #0a466a
    font-weight: 600
    font-size: 1rem
    tr
        border-bottom: 2px solid 
        border-color: #0a466a91

.question-cont
    display: flex
    margin-left: .5rem
.question-cont__li
    margin-left: .25rem

.required-error
    border: 1px solid !important
    border-color: red !important

// чиобы в колонка имени растягивалась на длину всего контента
// .td-name
//     width: max-content
.footer-buttons
    display: flex
    justify-content: end
    gap: 3%
.start-btn
    border: none !important
    background: green !important
    &:active
        background: #107609 !important
.stop-btn
    border: none !important
    background: red !important
    &:active
        background: red !important

.audio
    width: 100%
    height: calc(2rem + 2px)  // 2px это border input, форма input 34px
    background: white
    &::-webkit-media-controls-enclosure
        background-color: white
    &::-webkit-media-controls-panel
        padding: 0



.card-form
    display: flex
    justify-content: center
    background: white
    border-radius: 5px
    
    min-width: max-content 
    height: max-content
    padding: .5rem 2rem .5rem 1rem
    box-shadow: 0px 0px 31px 7px rgba(34, 60, 80, 0.17)
    transition: flex-wrap 0.5s ease
    .card-form__table
        border-collapse: collapse
        table-layout: auto 
        margin: 0
        user-select: none
        width: 100%
        height: max-content

        tr
            height: 3rem
            td
                padding: 0  //delete default padding
            td:first-child
                width: 0 //for grow disabling td
            td:nth-child(2)
                border-bottom: 1px solid 
                border-color: #425f7045
            td:last-child
                width: 0 //for grow disabling td
                border-bottom: 1px solid 
                border-color: #425f7045
        tr
            &:last-child
                td
                    border-bottom: 0






        .card-form__col-name
            text-align: right
            font-family: Roboto
            font-size: .875rem
            padding-right: 1rem

        .card-form__icon_plus
            width: 1.25rem
            cursor: pointer
            fill: white 

        .card-form__flex-container
            display: flex
            justify-content: center
            margin: 0 2rem
            gap: 2rem
            

            .card-form__flex-item
                display: flex
                align-items: center
                gap: .5rem
                .card-form__icon
                    width: 1.5rem
                    cursor: pointer
                    fill: black 
                    &[disabled=true]
                        fill: #c2c2c2


// table.card-form__table_draggable
//         &:hover
//             cursor: pointer
//         background: #c8d8d8
//         table-layout: auto 
//         margin: 0
//         user-select: none
//         width: 100%
//         height: max-content
//         tr
//             width: 100%
//             height: 3rem
//             td
//                 padding: 0  //delete default padding
//             td:first-child
//                 width: 0 //for grow disabling td
//             td:last-child
//                 width: 0 //for grow disabling td

//         .card-form__bottom
//             text-align: center

//         .card-form__col-name
//             text-align: right
//             font-family: Roboto
//             font-weight: 100
//             font-size: 1rem
//             padding-right: 1rem

//         .card-form__icon_plus
//             width: 1.25rem
//             cursor: pointer
//             fill: white 

//         .card-form__flex-container
//             display: flex
//             justify-content: center
//             margin: 0 2rem
//             gap: 2rem
            

//             .card-form__flex-item
//                 display: flex
//                 align-items: center
//                 gap: .5rem
//                 .card-form__icon
//                     width: 1.5rem
//                     cursor: pointer
//                     fill: black 
</style>

