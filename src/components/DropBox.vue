<script setup>
import { ref, watch, onMounted, onUpdated, onUnmounted  } from 'vue';
import Svg from '@components/Svg.vue';



// HTML Elements
const button = ref(null)
const list = ref(null)
const prelistwrap = ref(null)

// styles
const listHeight = ref(null)
const buttonCoords = ref(null)

// Parameters
const isVisible = ref(false)
let listItems = [10, 25, 50 , 100, 'all']
const currentValue = ref(listItems[0])

const directionExpand = ref('down')


const emits = defineEmits(['callback'])

async function selectItem(item){
  currentValue.value = item
  emits('callback', item)

  // не нужен так как будет click по overlay
  // toggleVisible()
  // console.log(item)
}




function calculationWindowFreeSpaceHeight(parentElCoords){
  let windowHeight = document.documentElement.clientHeight
  
  // помещается вниз
  if( (parentElCoords.bottom + listHeight.value) < windowHeight){
    // nothing
    directionExpand.value = 'down'
  }
  // помещается вверх
  else{
    directionExpand.value = 'up'
  }
}


function BindingListToButton(){
  if(directionExpand.value=='down'){
    list.value.style.top = buttonCoords.value.bottom + 'px'
    list.value.style.left = buttonCoords.value.left + 'px'
  }
  else{
    list.value.style.top = buttonCoords.value.top - listHeight.value + 'px'
    list.value.style.left = buttonCoords.value.left + 'px'
  }
}



const setState = () => {
  if(isVisible){

    buttonCoords.value = button.value.getBoundingClientRect()
    // направление разворачивания записывается в directionExpand.value
    calculationWindowFreeSpaceHeight(buttonCoords.value)
    // привязка к координатам родительского эелемента
    BindingListToButton() 
    
  if(isVisible.value){
    disableMarginStyle()
    list.value.style.opacity = 1

    if(directionExpand.value=='down'){
      list.value.style.height = 'auto'
    }
    else{
      list.value.style.height = listHeight.value + 'px'
    }
  }
  
  else{
    disableMarginStyle()
    directionExpand.value=='down' ? activateMarginStyleDown() : activateMarginStyleTop()
  }
}
}

function disableMarginStyle(){
  prelistwrap.value.style.marginBottom = '0px'
  prelistwrap.value.style.marginTop = '0px'
}

function activateMarginStyleTop(){
  prelistwrap.value.style.marginTop = listHeight.value + 'px'
  list.value.style.height = listHeight.value + 'px'
}

function activateMarginStyleDown(){
  list.value.style.height = 'auto'
  prelistwrap.value.style.marginBottom = -(listHeight.value) +'px'
}

const rObserver = ref(new ResizeObserver( () => setState()))

function observeHeight() {
  rObserver.value.observe(button.value)
}


onMounted(()=>{
  // получение высоты раскрывающегося меню
  listHeight.value = list.value.getBoundingClientRect().height
  buttonCoords.value = button.value.getBoundingClientRect()
  // отследить изменение button после добавления асинхронного SVG
  observeHeight()
  // отследить изменение клиентского окна
  window.addEventListener('resize', setState)

  // !не нужен, т.к. выполняется в observeHeight
  // setState()
})

onUpdated(()=>{
  // console.log('update')
  setState()
})

onUnmounted(()=>{
  // console.log('unmount')
  rObserver.value.disconnect()
  window.removeEventListener('resize', setState)
})


function toggleVisible(){
  isVisible.value = !isVisible.value
  
  if(isVisible.value){
    container_el.value.classList.remove('overlay-cont_disabled');
    list.value.style.opacity = 1
    disableMarginStyle()
  }
  else{
    directionExpand.value=='down' ? activateMarginStyleDown() : activateMarginStyleTop()
    // Чтобы видна была анимация
    setTimeout(()=>{
      container_el.value.classList.add('overlay-cont_disabled');
    }, 200)
    
    // console.log(container_el.value.className )
  }
}
const container_el = ref(null)
</script>

<template>
  

    <div ref="button" class="btn" @click="toggleVisible">      
      <span> {{currentValue}}   </span>
      
      <Svg  class="drop-menu__icon" name="chevron-down" :opened="isVisible"></Svg> 
    </div>

    <!-- привязан к button -->
    <template>      
      <Teleport to="body" >
        
        <div 
        ref="container_el"
          class="overlay-cont overlay-cont_disabled" 
          @click="toggleVisible"
        >

          <ul id=test ref="list" class="list">
            <div ref="prelistwrap" class="prelistwrap">
              <template v-for="item in listItems">
                <li @click="selectItem(item)"> {{ item }} </li>
              </template>
            </div>
          </ul>
        </div>
    </Teleport>
  </template>
</template>




<style lang="sass" scoped>
.overlay-cont
  position: fixed
  width: 100%
  height: 100%
  top: 0
  left: 0
  z-index: 3000
  user-select: none
  &.overlay-cont_disabled
    z-index: 1

.btn
  user-select: none
  // position: fixed
  position: static
  // position: absolute
  // test
  // top: 600px
  

  cursor: pointer
  width: 5rem
  padding: 0

  border: 1px solid
  border-color: #b0b0b0
  // background: #ccdde9
  background: #ededed
  box-sizing: border-box
  padding-left: .5rem
  display: flex
  align-items: center
  &:hover
    // background: #a5c5dc 
    background: #dbdbdb


.list
  opacity: 0
  overflow: hidden
  position: fixed
  width: 5rem

.prelistwrap
  // background: #979797
  background: #dbdbdb
  transition: all .1s ease



.drop-menu__icon
  fill: #0a466a 
  margin-left: auto
  width: 1.75rem
  transition: transform .2s
  transform: rotate(0deg)
  &[opened=true]
      transform: rotate(-180deg)


.liwrap
  height: max-content
  width: 5rem
  transition: height .2s ease
  overflow-y: hidden 
  background: #cbe0ff
  box-sizing: border-box
  padding: 0.25rem 0
li
  cursor: pointer
  padding-left: .5rem
  height: 1.5rem
  &:hover
    background: #aecef2

    


</style>