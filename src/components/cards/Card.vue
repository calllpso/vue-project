<script setup>
// value such field of json
import Btn from '@components/buttons/Btn.vue'
import Text from '@components/inputs/Text.vue'
import SliderRadio from '@components/inputs/SliderRadio.vue'
import Svg from '@components/Svg.vue'
import { ref,toRaw, watch } from 'vue'
import Autocomplete from '@components/inputs/Autocomplete.vue'


const props = defineProps({
    dataFields: Object,
    btnApplyName: String,
    disabledFields: { type: Array, required: false, default: []}
})

// emits
const emits = defineEmits(['callback'])
function callback(){
    emits('callback')
}



const localData = ref(props.dataFields);
// console.log(localData.value)

function addRow(){
    let entry = JSON.parse(JSON.stringify(toRaw(localData.value.multiple[0]))) //deep copy   
    entry.value = entry.type=='text' ? '' : false
    for (let key in entry.children.values) {
        entry.children.values[key].value = entry.children.values[key].type=='slider' ? false : ''
        if (key=='voice'){
            entry.children.values[key].value = entry.children.values[key].type=='slider' ? true : ''
        }
        
    }
    // чтобы не было перезаписи
    entry.id = 0
    // console.log(entry.id)
    localData.value.multiple.push(entry)
}
function delRow(index){
    if (localData.value.multiple.length > 1 ){
        localData.value.multiple.splice(index, 1)
    }
 }


  

// watch(
//     () => localData,
//     (newData) => {
// }, { deep: true }
// )

///////////////////////// Yet useless
// drag and drop priority changing
// const dragDrop = (event, item, index) => {
//     if (localData.value.multiple.length==1){
//         return 0
//     }
//     let dataCopy = JSON.parse(JSON.stringify(localData.value.multiple))
//     console.log('draggg')

//     // create wrap
//     let wrap = document.createElement('table');
//     wrap.classList.add('card-form__table_draggable');
//     let tr = document.getElementById(index + 'row')

//     // get width tr elements
//     for(var child=tr.firstChild; child!==null; child=child.nextSibling) {
//         child.style.width = child.getBoundingClientRect().width + 'px'
//     }
//     // get height and width
//     let trSize = tr.getBoundingClientRect()

//     wrap.style.position = 'absolute';
//     wrap.style.zIndex = 1000;
//     wrap.style.height = trSize.height + 'px'
//     wrap.style.width = trSize.width + 'px'
//     wrap.appendChild(tr);
    

//     document.body.append(wrap);
    

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp)
    
    
//     console.log('offset',event.pageX)

//     function onMouseMove(event) {
//         wrap.style.left = trSize.left + 'px';
//         wrap.style.top = event.pageY - wrap.offsetHeight / 2 + 'px';
//     }

//     function onMouseUp(e){
//         // insert and delete rows
//         // dataCopy.push(item)
//         // localData.value.multiple = dataCopy
//         document.removeEventListener('mousemove', onMouseMove)
//         document.removeEventListener('mouseup', onMouseUp);
//         wrap.remove()
//     }
//     function placeRow(mouseY){
//         let prependRow = null
//         const dragrows = Array.from(document.getElementsByClassName('dragrow'))
//         dragrows.forEach((row, index) => {
//             const rect = row.getBoundingClientRect();
//             if (mouseY > rect.top && mouseY < rect.bottom) {
//                 console.log(mouseY, rect.top, rect.bottom)

//                 prependRow =  row.id
//                 return
//             }
//         })
//         if (prependRow != null){
//             // console.log('for', prependRow)
//             return prependRow
//         }
//         else{
//             let rectFirstRow = dragrows[0].getBoundingClientRect()
//             prependRow = (mouseY > rectFirstRow.bottom) ? dragrows[dragrows.length-1].id : dragrows[0].id
//             // console.log('after for', prependRow)
//             return prependRow
//         }
//     }
// }
//\\\\\\\\\\\\\\\\\\\\\\


/////////// Yet Useful
const moveItem = (index, direction) => {
    if (direction === 'up' && index > 0) {
    // Передвигаем элемент вверх
        [localData.value.multiple[index - 1], localData.value.multiple[index]] = [localData.value.multiple[index], localData.value.multiple[index - 1]];
    } 
    else if (direction === 'down' && index < localData.value.multiple.length - 1) {
    // Передвигаем элемент вниз
        [localData.value.multiple[index + 1], localData.value.multiple[index]] = [localData.value.multiple[index], localData.value.multiple[index + 1]];
    }
};



function clickHandle(icon, index){
    if (icon=='delete'){
        delRow(index)
    }
    else if (icon.includes('arrow')){
        let direction = icon.split('-')[1]
        moveItem(index, direction)
    }
}

const audio_input = ref(null)
function serializeAudio(event, item){
    let audio = event.target.files[0]
    item.value = audio   
    // для отображения аудио плеера при загрузке файла
    audio_input.value = URL.createObjectURL(audio)
}
</script>

<template>
<div class="card-form" @keyup.enter="callback">
    <!-- {{ localData.single[0] }} -->
    <table class="card-form__table">
        <thead class="thead">
            <tr>
                <td></td>
                <td colspan="2">{{localData.head.text}}</td>
            </tr>
        </thead>
        <tbody>
            <!-- for -->
            <template v-for="item, field in localData.single">
                <!-- disabledFields -->
                <template v-if="!props.disabledFields.includes(field)">
                    <!-- has parent_binding -->
                    <template v-if="item.parent_bind==undefined">
                        <tr>
                            <td class="card-form__col-name"> <div class="td-name"> {{ item.name }} </div> </td>
                            <td colspan="2">

                                <!-- has child_binding  -->
                                <template v-if="item.child_bind==undefined">
                                    <!-- text row -->
                                    <Text  
                                        :type = "item.type" 
                                        v-if="(item.type=='text') || item.type=='password'" 
                                        placeholder="значение" 
                                        :value="item.value"
                                        @callback="(val) => item.value = val"
                                        :class="item.cssClass"
                                        :disabled="item.inputDisabled"
                                        
                                    />
                                                                        
                                    <!-- autocomplete row -->
                                    <Autocomplete
                                    v-if="item.type=='autocomplete'" 
                                        :data="item.data" 
                                        placeholder="значение" 
                                        :input_value="item.input_value" 
                                        :value="item.value" 
                                        @callback="(val) => item.object = val"
                                        :class="item.cssClass"
                                        /> 

                                    <!-- file row -->
                                    <template v-else-if="item.type=='file'" >
                                        <label class="input-file">

                                            <input
                                                type="file"
                                                @change="serializeAudio($event, item)"
                                                :class="item.cssClass"
                                                class="custom-file-input"
                                                name="file"
                                            />
                                            <span>Выберите файл</span>
                                        </label>
                                    </template>
                                    

                                    
                                    <audio 
                                        v-else-if="item.type=='audio'" 
                                        class="audio" 
                                        controls 
                                        :src="item.value" 
                                        type="audio/mpeg"
                                        :class="item.cssClass"
                                    ></audio>

                                    <SliderRadio v-else-if=" item.type == 'slider'" :value="item.value" @callback="(val) => item.value = val" />

                                    
                                </template>
                                <!-- row with child_bind -->
                                <template v-else>
                                    <Autocomplete
                                    :class="item.cssClass"
                                    v-if="item.type=='autocomplete'" 
                                        :data="item.data" 
                                        placeholder="значение" 
                                        :input_value="item.input_value" 
                                        :value="item.value" 
                                        @callback="(val) => {item.object = val 
                                            localData.single[item.child_bind].value = val
                                        }"
                                        /> 
                                    {{ localData.single[item.child_bind].value }}
                                </template>
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parent_bind!=undefined && item.value!= null">
                        <tr>
                            <td class="card-form__col-name"> <div class="td-name"> {{ item.name }} </div> </td>
                            <td colspan="2">
                                {{ item.value}}
                                <!-- не добавил :class="item.cssClass"  -->
                                <audio 
                                    class="audio" 
                                    controls 
                                    :src="item.todoFunction()"

                                    type="audio/mpeg"
                                ></audio>

                            </td>

                        </tr>
                    </template>                                
                </template>
            </template>

            <!-- audio player  (for upload)-->
            <tr v-if="audio_input!=null" >
                <td class="card-form__col-name"> <div class="td-name"> Аудио </div> </td>
                <td colspan="2">
                    <audio 
                    class="audio" 
                    controls 
                    :src="audio_input" 
                    type="audio/mpeg"
                    ></audio>
                </td>
            </tr>
            <!-- audio end -->

            <template v-for="(item, index) in localData.multiple" >
                    
                <tr :id="index + 'row'">
                    <td class="card-form__col-name"> <div class="td-name"> {{ item.name }} </div> </td>
                    
                    <td v-if="item.type=='text'">
                        <Text 
                            placeholder="значение" 
                            :value="item.value" 
                            @callback="(val) => item.value = val"
                            :class="item.cssClass"
                        />
                    </td>

                    <td v-if="item.children">
                        <div class="card-form__flex-container">

                            <template v-for="el in item.children.values">
                                <div class="card-form__flex-item card-form__flex-icons"> 
                                    <SliderRadio v-if=" el.type == 'slider'" :value="el.value" @callback="(val) => el.value = val" />
                                    <Svg class="card-form__icon" :class="'icon-'+el.icon"  :name="el.icon" @click="el.value=!el.value"></Svg>
                                </div>    
                            </template>   

                            <template v-for="el in item.children.other">
                                <div class="card-form__flex-item"> 
                                    
                                        
                                    <Svg
                                        :class="'icon-'+ el.icon"
                                        v-if=" el.type == 'icon'"  
                                        class="card-form__icon" 

                                        :name="el.icon"
                                        @click="clickHandle(el.icon, index)"
                                        :disabled="(el.icon == 'arrow-up' && index==0) || (el.icon == 'arrow-down' && index==localData.multiple.length - 1)"
                                        >
                                        <!-- @click="el.icon == 'delete' ? delRow(index) : ''" -->
                                    </Svg>   
                                    <!-- {{ el.icon }} -->
                                </div>    
                            </template>   

                        </div>
                    </td>
                </tr>
            </template>
            <tr v-if="dataFields.hasOwnProperty('multiple')">
                <td  class="card-form__col-name">
                    <Btn class="btn-plus" @click="addRow"> <Svg class="card-form__icon_plus" name="plus"></Svg> </Btn>
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="3" class="card-form__bottom"><Btn @click="callback">{{ btnApplyName }}</Btn></td>
            </tr>

        </tbody>
    </table>
</div>


</template>

<style lang="sass" scoped>
@import '@assets/main'
.btn-plus
    background: #0a466a

.thead
    color: #0a466a
    font-weight: 600
    font-size: 1rem
    tr
        border-bottom: 2px solid 
        border-color: #0a466a91

.input-file span 
    cursor: pointer
    color: rgb(255 255 255)
    border-radius: 4px
    background-color: #419152
    padding: 10px 20px
    transition: all 0.2s
    &:hover
        background-color: #3c834b

    &:active
        background-color: #ddd
        



.input-file input[type=file] 
    position: absolute
    z-index: -1
    opacity: 0
    display: block
    width: 0
    height: 0



// чиобы в колонка имени растягивалась на длину всего контента
// .td-name
//     font-size: .875rem
//     width: max-content

.required-error
    border: 1px solid !important
    border-color: red !important
.audio
    width: 100%
    height: calc(2rem + 2px)  // 2px это border input, форма input 34px
    background: white
    &::-webkit-media-controls-enclosure
        background-color: white
    &::-webkit-media-controls-panel
        padding: 0


.card-form
    background: white
    border-radius: 5px
    display: flex
    justify-content: center
    min-width: max-content 
    height: max-content
    padding: .5rem 2rem .5rem 1rem
    // box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25)
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
                width: 0 //for grow
            td:nth-child(2)
                border-bottom: 1px solid 
                border-color: #425f7045
            td:last-child
                width: 0 //for grow disabling td
                border-bottom: 1px solid 
                border-color: #425f7045
        tr:nth-last-child(2)
            td
                border-bottom: 0

        tr:last-child
            td
                border-bottom: 0

        .card-form__bottom
            text-align: end

        .card-form__col-name
            text-align: right
            font-family: Roboto
            // font-weight: 100
            font-size: .875rem
            padding-right: 1rem

        .card-form__icon_plus
            width: 1.25rem
            cursor: pointer
            fill: white 

        .card-form__flex-container
            display: flex
            justify-content: center
            margin-left: auto
            // gap: 2rem
            
                
            
            // margin-left: 1rem

            .card-form__flex-item
                // first slider
                &:first-child
                    margin-left: 2rem !important
                // 2 slider
                &:nth-child(2)
                    margin-left: 2rem !important

                &:nth-child(3)
                    margin-left: 2rem !important
                
                &:nth-child(4)
                    margin-left: 1rem !important


                display: flex
                align-items: center
                gap: .5rem
                .card-form__icon
                    width: 1.5rem
                    cursor: pointer
                    fill: black 
                    &[disabled=true]
                        fill: #c2c2c2
                    &.icon-delete
                        fill: rgba(179, 40, 40, 0.8705882353)
                    &.icon-email
                        fill: #d97a10
                    &.icon-telephone
                        fill: #0a466a
                    &.icon-phone-classic
                        fill: #0a466a
                        



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
//             // font-weight: 100
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

