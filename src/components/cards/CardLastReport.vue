<script setup>
// value such field of json
import Btn from '@components/buttons/Btn.vue'
import Text from '@components/inputs/Text.vue'
import { ref, watch } from 'vue'

import TextArea from '@components/inputs/TextArea.vue'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'

const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()

const props = defineProps({
    dataFields: null,
    href: null,
    clickFunction: null,
})


const localData = ref(props.dataFields);


// getting audio
const audioFile = ref(null)

const configAudio = ref(false)
// sms
const configSms = ref(false)


watch(
    () => props.dataFields,
    async (newLocalData) => {
        localData.value = newLocalData
}, { deep: true }
)


</script>

<template>
    
<div class="card-form" v-if="localData" >
    <table class="card-form__table">
        <thead class="thead">
            <tr>
                <td></td>
                <td colspan="2">
                    
                    {{localData.head.text}} 
                    <br>
                     Подтверждено оповещение для {{ localData.single.notified.value }} сотрудников
                </td>
            </tr>

        </thead>
        
        <tbody>
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
                <tr><td colspan="3" class="td-report">
                    <a 
                        @click.prevent="clickFunction"    
                        :href="href"
                    >
                        <Btn>Перейти в отчет</Btn>
                    </a>
                </td></tr>
        </tbody>
    </table>
    
</div>
</template>


<style lang="sass">
@import '@assets/main'
.td-report
    text-align: center
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

