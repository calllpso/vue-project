<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';
import Svg  from '@components/Svg.vue';


// elements
const tooltip = ref(null)
const content = ref(null)
const overlay = ref(null)
// coords
const tooltipCoords = ref(null)
const contentCoords = ref(null)

const isShow=ref(false)
const rObserver = ref(new ResizeObserver( () => setState()))


function BindingListToButton(){
    // console.log(tooltipCoords.value)
    content.value.style.left = tooltipCoords.value.right + 'px'
    // высота по середине
    // content.value.style.top = tooltipCoords.value.top + tooltipCoords.value.height/2 - contentCoords.value.height/2 + 'px'
    content.value.style.top = tooltipCoords.value.top - contentCoords.value.height + 'px'
}

const setState = () => {
    if(isShow.value){
        tooltipCoords.value = tooltip.value.getBoundingClientRect()
        contentCoords.value = content.value.getBoundingClientRect()
        // привязка к координатам родительского эелемента
        BindingListToButton() 
    }
}


function toggleShow(){
    isShow.value = !isShow.value
}
function clickOverlay(e){
    // console.log(e.target)
    // console.log(overlay.value)
    console.log(e.target == overlay.value)
    // if(e.target!=content.value){
    if(e.target == overlay.value){
        console.log('offf')
        toggleShow()
    }
}
function observeHeight() {
  rObserver.value.observe(tooltip.value)
}

onMounted(()=>{
    observeHeight()
    window.addEventListener('resize', setState)
})
onUpdated(()=>{
    setState()
})
onUnmounted(()=>{
  rObserver.value.disconnect()
  window.removeEventListener('resize', setState)
})
</script>




<template>
    <span class="tooltip"
        ref="tooltip"
        ><Svg
        name="help"
        @click="toggleShow"           
    >
    </Svg></span>

    <Teleport to="body" 
    v-if="isShow">
        <div class="overlay"
            ref="overlay"
            @click="clickOverlay"           
        >
            <div 
                ref="content"
                class="tooltip__content" 
            >
                <!-- <div class="tooltip__text"> -->
                    <slot></slot>
                <!-- </div> -->
            </div>
        </div>
    </Teleport>
    
</template>



<style lang="sass" scoped>
.tooltip
    display: flex
    width: 1.375rem
    height: 1.375rem
    // justify-content: center
.overlay
    z-index: 3000
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0

.tooltip__content
    border: 1px solid
    position: fixed
    z-index: 3000
    // background: #ddd
    background: white
    opacity: .75
    max-width: 17rem
    padding: .5rem
    // text-align: center
    // display: flex
    // justify-content: center
    


</style>

