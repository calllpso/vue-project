<script setup>
import Svg from '@components/Svg.vue';
import Text from '@components/inputs/Text.vue';
import DropBox from '@components/DropBox.vue';
import TableNested from '@components/tables/TableNested.vue';
import { CallInfoTable, SmsInfoTable } from '@classes/tables'

import {ref, computed} from 'vue'

const props = defineProps({
    data: null,
    clickRow_Function: null
})



// pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => {
    return Math.ceil(props.data.tbody.length / itemsPerPage.value) //вернуть целочисленный результат от деления
})
const minRow = computed(() => { return (currentPage.value - 1)*itemsPerPage.value })
const maxRow = computed(() => { return (minRow.value + itemsPerPage.value) })

const tableRef = ref(null)


function changePage(val){
    tableRef.value.scrollTop = 0

    if (typeof val === 'number') {
       currentPage.value += (val > 0 && currentPage.value < totalPages.value) ? val : (val < 0 && currentPage.value > 1) ? val : 0;
    }
    else {
        currentPage.value = (val === 'start') ? 1 : totalPages.value;
    }
}

function setItemPerPage(items){
    itemsPerPage.value = typeof(items) == 'number' ? items : props.data.tbody.length
}


function returnCallInfoTable(callData){
    const callInfoTable = ref(new CallInfoTable(callData))
    return callInfoTable.value
}

function returnSmsInfoTable(smsData){
    const smsInfoTable = ref(new SmsInfoTable(smsData))
    return smsInfoTable.value
}

// позже создать watch для прослушивания вложений, если все развернуты, то предлагать свернуть. если не открыто хотя бы одно, то развернуть
const expandStatus = ref(true)


function expandNestes(){
    expandStatus.value = !expandStatus.value
    for (let row in props.data.tbody){
        props.data.tbody[row].nesteds_visible = expandStatus.value
    }
}


</script>



<template>
    <div class="custom-table" v-if="data!=null">
        <header class="header">
            <Text class="header__input"
            placeholder = "Быстрый поиск"  
            @callback="(val) => data.search(val)"
            postIcon="magnify"
            />
            <div @click="expandNestes"> {{expandStatus ? 'свернуть всё' : 'развернуть всё' }} </div>
        </header>
        <div class ='custom-table__content'> 


            <main class="main" ref="tableRef">
                <table>
                    <thead>
                        <tr>
                            <!-- <th class="main__th main__chevron" @click="expandNestes">
                                <Svg class="icon icon-chevron" name="chevron-down" :open="expandStatus"></Svg>
                            </th> -->
                            <th class="main__th main__chevron"></th>

                            <template v-for="(head, key) in data.thead">
                                <th class="main__th" @click="data.setSort(key)">
                                    <div class="th__content" >
                                        <span> {{ head.value }} </span>
                                        
                                        <Svg class="th__icon" 
                                        :class="{
                                            visible: head.sort !=null, 
                                            rotate: head.sort == 'desc'
                                        }"
                                        :name ="'arrow-up'" ></Svg>
                                    </div>
                                </th>
                            </template>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="(row, index) in data.tbody">
                            <template v-if="(index < maxRow) && (index >= minRow)">

                                <tr class="employee-tr" :id="`${row.service.id}row`" @click=" props.clickRow_Function != null ? props.clickRow_Function(row.service.id): null">
                                    <td class="parent-td main__chevron" @click="row.nesteds_visible=!row.nesteds_visible">
                                        <Svg class="icon icon-chevron" name="chevron-down" :open="row.nesteds_visible"></Svg>
                                    </td>
                                    <template v-for="field, key in row.common">
                                        <!-- columns -->
                                            <td class="parent-td"> {{field}} </td>
                                        
                                    </template>
                                </tr>

                                <!-- calls -->
                                <template v-if="(row.nesteds.calls.length>0) && (row.nesteds_visible == true)">
                                    <tr> 
                                        <td class="name-nested-table" 
                                        :colspan="Object.keys(row.common).length + 1" 
                                        > 
                                            <div class="name-nested-table__container" >
                                                <span>
                                                    Звонки
                                                </span>
                                            </div>
                                        </td> 
                                    </tr>
                                    <tr>
                                        <td  :colspan="Object.keys(row.common).length + 1">
                                            <TableNested class="nested-table"
                                            :data="returnCallInfoTable(row.nesteds.calls)"
                                            ></TableNested>
                                        </td>
                                    </tr>
                                </template>

                                <!-- sms -->
                                <template v-if="(row.nesteds.sms.length>0) && (row.nesteds_visible)">
                                    <tr> 
                                        <td class="name-nested-table" 
                                            :colspan="Object.keys(row.common).length + 1"
                                        > 
                                            <div class="name-nested-table__container" >
                                                <span>
                                                    Сообщения
                                                </span>
                                            </div>
                                        </td> 
                                    </tr>
                                    <tr>
                                        <td :colspan="Object.keys(row.common).length + 1">
                                            <TableNested class="nested-table"
                                            :data="returnSmsInfoTable(row.nesteds.sms)"
                                            ></TableNested>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </template>

                    </tbody>
                </table>
            </main>
        </div>
        <footer class="footer">
            <div class="pagination">

                <span class="pagination__text">  Элементов на странице: </span>
                <DropBox @callback="(val) => setItemPerPage(val)"/>
                <span class="pagination__text"> Страница: {{ currentPage }} из {{totalPages}} </span>
                <Svg class="icon" name="page-first"  @click="changePage('start')"></Svg>
                <Svg class="icon" name="chevron-left" @click="changePage(-1)"></Svg>
                <Svg class="icon" name="chevron-right" @click="changePage(+1)"></Svg>
                <Svg class="icon" name="page-last" @click="changePage('end')"></Svg>

                <span class="pagination__text"> Элементов: {{data.tbody.length}} </span>

            </div>
        </footer>

    </div>
</template>

<style lang="sass" scoped>
$height__row: 3rem
$height__headerFooter: 2rem

.custom-table__content
    height: 100%
    // height: 80%
    padding-left: 1rem
    padding-right: 1rem
    overflow: hidden
    // margin: auto
    
    // max-width: $width
    min-width: min-content
.icon
    width: 1.5rem
    fill: black

.icon-chevron
        
        transition: transform .15s
        &[open=true]
            transform: rotate(0deg)
        &[open=false]
            transform: rotate(-90deg)

.name-nested-table__container
    display: flex
    justify-content: center
    cursor: pointer


    
.name-nested-table
    padding-left: 2rem
    text-align: center
    font-weight: 600
    color: #0a466a
    //
.nested-table
    padding-left: 2rem
    // background: #bebebe
    
.custom-table
    border-radius: 4px
    // overflow: hidden
    width: 100%
    min-width: min-content  // для печати скрыть scrollbar
    background: white

.main
    overflow-y: auto
    width: 100%
    max-height: 100%
    max-height: calc(100% - 2* $height__headerFooter)

    table
        width: 100%
        border-collapse: collapse
        // border-collapse: separate
        // border-spacing: 0 3rem
        
        background: white
        thead    
            color: #0a466a
            user-select: none
            cursor: pointer
            // background: #a0c9ff
            position: sticky
            top: 0
            tr
                height: $height__row
                font-weight: 600
                border-bottom: 2px solid
                border-color: #0a466a91
                    
                th
                    font: unset
                    width: 9rem

                    &.main__chevron
                        cursor: default
                        width: 2rem !important

                    &:first-child 
                        padding-left: 1rem
                    &:hover 
                        .th__icon:not(.visible)
                            opacity: 0.5
                    .th__content
                        display: flex
                        gap: .25rem
                    .th__icon
                        // fill: black
                        opacity: 0
                        width: 1.25rem
                        transition: all .18s
                        &.visible
                            opacity: 1
                        &.rotate
                            transform: rotate(180deg)
        tbody
            tr
                height: $height__row

                background: white

                &.employee-tr
                    border-top: 2px solid
                    border-bottom: 2px solid
                    border-color: #425f7045
                    &:hover
                        background: #EDF1F9
                td
                    // padding-left: 1rem
                    // &:first-child 
                    //     padding-left: 1rem
                    // &:last-child 
                    //     padding-right: 1rem

                .parent-td
                    padding-top: 1.5rem
                    padding-bottom: 1.5rem
                    &.main__chevron
                        cursor: pointer
                    &:first-child 
                        padding-left: 1rem
                        
                .actions
                    display: flex
                    gap: .5rem
                    .th__icon
                        width: 1.5rem
                        fill: black
    
header
    padding-top: .5rem 
    gap: 3rem
    display: flex
    height: $height__headerFooter
    position: sticky
    overflow: hidden !important
    top: 0
    left: 0
    user-select: none
    margin-left: 1.3rem
    
    .header__input
        border-bottom: 1px solid
        border-color: #425f7045
        min-width: min-content
        height: 100%
    .header__buttons
        display: flex
        gap: 2rem
        margin-left: auto
        margin-right: 1rem
        height: 100%

    
 

footer
    min-width: max-content
    height: $height__headerFooter
    border-radius: 0 0 4px 4px
    position: sticky
    // position: static
    user-select: none
    background: #dddddd
    bottom: 0
    left: 0
    .pagination
        display: flex
        gap: .5rem
        margin-left: 1rem
        height: 100%
        align-items: center

        .pagination__text
            margin-right: .5rem



    
</style>
