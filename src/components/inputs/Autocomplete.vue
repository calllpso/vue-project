<script setup>
import { ref, watch, onMounted, toRaw, onBeforeMount  } from 'vue';
import { createPopper } from '@popperjs/core'
import Svg from '@components/Svg.vue';

// HTML Elements
const button = ref(null)




const props = defineProps({
    data: null,
    input_value: null,
    placeholder: null,
    value: null
})
const localData = ref(null)
localData.value = props.data

watch(
    () => props.data,
    (newData) => {
      localData.value = newData
    }
)


// Parameters
const isVisible = ref(false)
const currentValue = ref(props.value)
watch(
    () => props.value,
    (newValue) => {
      currentValue.value = newValue
    }
)

function toggleVisible(){
  isVisible.value=!isVisible.value
  // console.log('here')
  // if (isVisible.value){
    // input.value.focus()
  // }
}

async function selectItem(item){
    currentValue.value = item[props.input_value]
    toggleVisible()
}

function checkInputValue(){
  let searchText = currentValue.value

  if (searchText!=null){

    // let matchItem = _.filter(props.data, (division) => {
    //   return division.division.toLowerCase() == searchText.toLowerCase()
    // });
    let matchItem = _.filter(props.data, (item) => {
      return item[props.input_value].toLowerCase() == searchText.toLowerCase()
    });


    // clear input value
    if(matchItem.length != 0){
      currentValue.value = matchItem[0][props.input_value]        
    }
    else{
      currentValue.value = null
    }
    
    
    return matchItem.length != 0 ? matchItem[0] : null
  }
  else{
    return searchText
  }
}

const emits = defineEmits(['callback'])



watch(
    () => isVisible.value,
    (newVisible) => {
        if(newVisible==false){
          let result = checkInputValue()
          
          // ITEM
          emits('callback', result)
          // сброс фильтра
          localData.value = props.data
        }
    }
)


import _ from 'lodash';
function search(event){
    let searchText = event.target.value
    console.log('in')
    let t = _.filter(props.data, (item) => {
            // !!!!!!!!!!!!!!!!
            console.log(item, props.input_value)
            return item[props.input_value].toLowerCase().includes(searchText.toLowerCase())
          });
    localData.value = t
}

const input =ref(null)



</script>

<template>
    <div ref="button" class="popper-btn" @click="toggleVisible" v-if="localData!=null">
      <input ref="input" class="input" type="text" v-model="currentValue"  @input="search" :placeholder="placeholder">
      <Svg  class="drop-menu__icon" name="chevron-down" :opened="isVisible" ></Svg> 
      
      <v-overlay
      :scrim="false"
      v-model="isVisible"
      target="parent"
      location-strategy="connected"
      >   
      <div class="test">
        <ul class="select-list" >
              <template v-for="item in localData">
                <li @click="selectItem(item)"> 
                    {{ item[props.input_value] }}
                </li>
              </template>
              <template v-if="localData.length==0" >
                <li > No data </li>
              </template>
          </ul>

        </div>
        
    </v-overlay>
  </div>
      
</template>




<style lang="sass" scoped>
.test 
  background: white
  
.input
    all: unset
    width: 100%
    &::-webkit-input-placeholder
            opacity: 0.5

.overlay
    position: fixed
    z-index: 50
    top: 0
    left: 0
    width: 100%
    height: 100%


.select-list
    color: black
    cursor: pointer
    z-index: 1000
    
    li
      padding: 0 0.5rem
    li:hover
        background: #a5c5dc 
.popper-btn

  // min-width: 25rem
  width: 100%
  padding: 0
  // font-weight: 300
  // color: #ddd
  // opacity: .5
  // border: 1px solid
  // border-color: #b0b0b0
  // background: #ccdde9
  height: 2rem
  background: #f1f1f1
  box-sizing: border-box
  padding-left: .5rem
  display: flex
  align-items: center

  
.drop-menu__icon
    cursor: pointer
    margin-left: auto
    width: 1.75rem
    transition: transform .2s
    transform: rotate(0deg)
    &[opened=true]
        transform: rotate(-180deg)


</style>