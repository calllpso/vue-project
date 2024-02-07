<script setup>
import Svg from '@components/Svg.vue';
import Text from '@components/inputs/Text.vue';

import DropBox from '@components/DropBox.vue';
import {ref, computed, watch, onMounted, onUpdated} from 'vue'
import Checkbox from '@components/inputs/Checkbox.vue';
import Btn from '@components/buttons/Btn.vue'

const props = defineProps({
    data: null,
    actions: null,
    clickRow_Function: null,
    checkboxMode: false,
    headerButtons: null,
    preHeaderName: false,
    width: '100%',
    closeMode: false
    // footerMode: true

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
    // timeout for render
    // setTimeout(resizeCustomTable, 100)
}



// checking
const checkList = ref([])

const mainCheckBox = ref(false)


function CheckAll(value){
    
    mainCheckBox.value = value
    // console.log('checkall')
    for(let index in props.data.tbody){
        let item = props.data.tbody[index]
        // checkList.value.push(item_id)
        item.service.checked=mainCheckBox.value
        // console.log(item.service)
    }
    // console.log(props.data.tbody)


}

// checked main checkbox
watch( () => checkList.value,
    (newCheckList) => {
        if(newCheckList.length == props.data.tbody.length){
            mainCheckBox.value = true
        }
        else if (newCheckList.length== 0 ){
            mainCheckBox.value = false
        }
}, {deep: true}
)


onUpdated(()=>{
})

// const lenData = ref(0)
watch( () => props.data,
    (newData) => {
        // disable checking
        CheckAll(false)
        checkList.value=[]
}
)

// checked main checkbox


function CheckRow(checked, id){
    // checked
    if(checked){
        checkList.value.push(id) 
    }
    // unchecked
    else{
        const index = checkList.value.indexOf(id)
        if (index > -1) { 
            checkList.value.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
}

const emits = defineEmits(['callback_1', 'callback_2', 'callback_close'])
function callback_1(){
    // console.log('callback_1 исключить', checkList.value)
    emits('callback_1', checkList.value)
}
function callback_2(){
    emits('callback_2')
}
function callback_close(){
    emits('callback_close')
}

const customTable = ref(null)
const customTableContent = ref(null)


// function resizeCustomTable(){
//     console.log('resize')
//     let customTableHeight = customTable.value.getBoundingClientRect().height

//     let customTableContentHeihgt = customTableContent.value.getBoundingClientRect().height
//     // console.log(customTableHeight, customTableContentHeihgt)
// }
// кнопка action для отправки ckeckboxes желательное расположение быть где-то в таблице


</script>

<template>
    
    <div class="custom-table" ref="customTable" v-if="props.data!=null">

        <div class="preheader">
            <template v-if="preHeaderName">
                {{ preHeaderName }}
            </template>
        </div>

        <header class="header">
            <Text class="header__input"
            placeholder = "Быстрый поиск"  
            @callback="(val) => props.data.search(val)"
            postIcon="magnify"
            />
            <div class="header__buttons" v-if="headerButtons != null">
                <Btn
                    @click="callback_1"
                    >{{ headerButtons[0] }}
                </Btn>
                
                <Btn 
                    class="start-btn" 
                    @click="callback_2" 
                    v-if="headerButtons[1]!=undefined "
                    >{{ headerButtons[1] }} 
                </Btn>

                <Btn 
                    v-if="closeMode"
                    @click="callback_close" 
                    >X 
                </Btn>
            </div>
        </header>
    <div class="custom-table__content" ref="customTableContent">

    

        
        <main class="main" ref="tableRef">
            <table>
                <thead>
                    <tr>
                        <!-- checkboxMode -->
                        <template v-if="props.checkboxMode">
                            <th class="th-checkbox">
                                <div class="th-checkbox__cont">
                                    <Checkbox 
                                        @callback="(value) => CheckAll(value)" 
                                        :val="mainCheckBox" 
                                        /> 
                                </div>
                            </th>
                        </template>

                        <template v-for="(head, key) in props.data.thead">
                            <th class="main__th" @click="props.data.setSort(key)">
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
                        <template v-if="actions != null">
                            <th class="main__th actions__th">
                                <div class="th__content" >
                                    <!-- <span> actions </span> -->
                                </div>
                            </th>
                        </template>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="(row, index) in props.data.tbody">
                        <template v-if="(index < maxRow) && (index >= minRow)">

                            <tr :id="`${row.service.id}row`" @click=" props.clickRow_Function != null ? props.clickRow_Function(row.service.id): null">
                                <!-- checkboxMode -->
                                <template v-if="props.checkboxMode">
                                    <td class = "td-checkbox">
                                        <div class="td-checkbox__cont">
                                            <!-- <input type="checkbox"> -->
                                            <Checkbox :val="row.service.checked" v-model="row.service.checked" @callback="(value) => CheckRow(value, row.service.id)"/>
                                        </div>
                                    </td>
                                </template>

                                <template v-for="field, key in row.common">
                                    <!-- columns -->
                                    
                                    <template v-if="typeof(field) != 'object' ">
                                        <template v-if="props.data.thead[key].serializeFunction == undefined">
                                            <!-- <td> {{typeof(field)}}  </td> -->
                                            <td>
                                                
                                                <template v-if="props.data.thead[key].viewFunction!=undefined">
                                                    <!-- splitting -->
                                                    <template v-for="time in props.data.thead[key].viewFunction(field)">
                                                        {{ time }}
                                                        <br>
                                                    </template>
                                                    
                                                </template>
                                                <template v-else>
                                                    <template v-if="props.data.thead[key].type == undefined">
                                                        {{field }}     
                                                    </template>
                                                    <template v-else-if="props.data.thead[key].type == 'icon'">
                                                        <!-- array -->

                                                        <div class="td__icon-wrap">
                                                                <template v-if="field.split(',').length == 1">
                                                                    <span class="td__icon" >
                                                                        <Svg :class="'icon-'+field.split(',')[0]" :name ="field.split(',')[0]" ></Svg>
                                                                    </span>
                                                                </template>
                                                                <template v-else-if="field.split(',').length == 2">
                                                                    <span class="td__icon"  >
                                                                        <Svg class="icon-phone-classic" name ="phone-classic" ></Svg>
                                                                    </span>
                                                                    <span class="td__icon" >
                                                                        <Svg class="icon-email" name ="email" ></Svg>
                                                                    </span>
                                                                </template>
                                                        </div>
                                                        
                                                                    <!-- <Svg 
                                                                    :name ="fieldItem" 
                                                                    ></Svg> -->
                                                                    <!-- {{ fieldItem }}1 -->

                                                    </template>
                                                </template>
                                            </td>
                                            
                                        </template>
                                        <template v-else>
                                            <td>
                                                <template v-if="typeof(props.data.thead[key].serializeFunction(field)) != 'object'">
                                                    {{ props.data.thead[key].serializeFunction(field) }}
                                                </template>
                                                <template v-else>
                                                    <template v-for="item in props.data.thead[key].serializeFunction(field)">
                                                        {{ item }}
                                                        <br>
                                                    </template>
                                                </template>
                                            </td>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <td> 
                                            <!-- phone -->
                                            <template v-for="phone in field">       
                                                {{ phone }}
                                                <br>
                                                <!-- {{field.length }}   -->
                                            </template>

                                            <!-- warning icon if not phones -->
                                            <template v-if="field!=null">
                                                <template v-if="field.length==0">
                                                    <Svg class="icon-delete" name=alert></Svg>
                                                </template>
                                            </template>
                                        </td>
                                    </template>
                                    
                                </template>

                                <!-- actions -->
                            <template v-if="actions != null">
                                <td>
                                    <div class="actions">
                                        <!-- {{actions.find(action_name => actionname)}} -->
                                        <!-- actions.hasOwnProperty('change') -->
                                        <template v-if="actions.hasOwnProperty('change')">
                                            <Svg class="th__icon th__icon_pencil" name=pencil 
                                                @click="actions.change(row.service.id)"
                                            ></Svg>
                                        </template>
                                        
                                        <template v-if="actions.hasOwnProperty('delete')">
                                            <!-- {{ row.service.id }} -->
                                            <Svg class="th__icon th__icon_delete" name=delete 
                                                @click="actions.delete(row.service.id)"
                                            ></Svg>
                                        </template>
                                    </div>
                                    <!-- {{ row.service.id }}  -->
                                </td>
                            </template>
                            </tr>
                        </template>
                    </template>
                
                </tbody>
            </table>
        </main>

    </div>
    <footer class="footer" >
        <div class="pagination">

            <span class="pagination__text">  Элементов на странице: </span>
            <DropBox @callback="(val) => setItemPerPage(val)"/>
            <span class="pagination__text"> Страница: {{ currentPage }} из {{totalPages}} </span>
            <Svg class="icon icon-footer" name="page-first"  @click="changePage('start')"></Svg>
            <Svg class="icon icon-footer" name="chevron-left" @click="changePage(-1)"></Svg>
            <Svg class="icon icon-footer" name="chevron-right" @click="changePage(+1)"></Svg>
            <Svg class="icon icon-footer" name="page-last" @click="changePage('end')"></Svg>

            <span class="pagination__text"> Элементов: {{props.data.tbody.length}}</span>

        </div>
    </footer>
    </div>
</template>

<style lang="sass" scoped>
$height__row: 3rem
$height__headerFooter: 2rem

// 
$width: v-bind('width')

.icon-telephone, .icon-phone-classic
    fill: #0a466a
.icon-email
    fill: #d97a10

    

.icon-delete
    display: flex
    width: 1.25rem
    fill: red
.preheader
    padding-left: .5rem
    font-size: 1.25rem
.td__icon-wrap
    display: flex
    gap: .5rem
.td__icon
    display: flex
    width: 1.25rem

.th__icon
    &.th__icon_pencil
        fill: #0a466a 
    &.th__icon_delete
        fill: #b32828de

.icon-footer
    fill: #0a466a  !important

.custom-table
    overflow: hidden
    width: 100% //добавил
    height: 100%
    min-width: min-content
    
    background: white
    border-radius: 5px
    .custom-table__content  //добавил
        height: 100%
        padding-left: 1rem
        padding-right: 1rem
        margin: auto
        
        // max-width: $width
        min-width: min-content
    
    box-shadow: 0px 0px 31px 7px rgba(34, 60, 80, 0.17)
.main
    overflow-y: auto
    width: 100%
    max-height: 100%
    max-height: calc(100% - 2* $height__headerFooter)

    table
        width: 100%
        border-collapse: collapse
        
        background: white
        thead    
            color: #0a466a
            user-select: none
            cursor: pointer
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
                    background: white
                    &:first-child 
                        padding-left: 1rem
                    &:hover 
                        .th__icon:not(.visible)
                            opacity: 0.5
                    .th__content
                        display: flex
                        gap: .25rem
                    .th__icon
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
                border-bottom: 1px solid
                border-color: #425f7045

                &:hover
                    background: #EDF1F9
                td
                    
                    &:first-child 
                        padding-left: 1rem
                    &:last-child 
                        padding-right: 1rem
                
                .actions
                    display: flex
                    gap: 1rem
                    cursor: pointer
                    .th__icon
                        width: 1.25rem
header
    padding-top: .5rem 
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
    color: #0a466a
    min-width: max-content
    height: $height__headerFooter
    position: sticky
    user-select: none
    bottom: 0
    left: 0
    margin-left: 1rem
    .pagination
        display: flex
        gap: .5rem
        margin-left: 1rem
        height: 100%
        align-items: center

        .pagination__text
            margin-right: .5rem
.icon
    width: 1.5rem
    fill: black

.actions__th
    max-width: 3rem     //???

.th-checkbox, .td-checkbox
    padding-left: 0 !important
    max-width: 3rem !important
    .th-checkbox__cont, .td-checkbox__cont
        display: flex
        justify-content: center
    
</style>
