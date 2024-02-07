<script setup>
import Svg from '@components/Svg.vue';
import {ref, watch, onUpdated  } from 'vue'

import router from '@router/index'

const props = defineProps({
    menus: {
        type: Object,
        required: true
    },
    collapsedSideBar: Boolean,
    pinSideBar: Boolean,
})

// может быть избыточно, но так submenu закрываются даже если пользователь быстро уберет курсор
watch(
    () => props.collapsedSideBar,
    (stateExpand) => {
        if(stateExpand){
            // свернуть если не нажат pin и нет hover
            const filteredArray = props.menus.filter(obj => obj.hasOwnProperty('children'));
            filteredArray.forEach((item)=>{
                let target = document.getElementById(item.id)
                let expanded = JSON.parse(target.nextElementSibling.getAttribute('visible'))
                if(expanded){
                    toggleSubmenu(target)
                }
            })
        }
    }
)
watch(
    () => props.pinSideBar,
    (pinState) => {
        if(!pinState){
            console.log(pinState)
            // свернуть если не нажат pin и нет hover
            const filteredArray = props.menus.filter(obj => obj.hasOwnProperty('children'));
            filteredArray.forEach((item)=>{
                let target = document.getElementById(item.id)
                let expanded = JSON.parse(target.nextElementSibling.getAttribute('visible'))
                if(expanded){
                    toggleSubmenu(target)
                }
            })
        }
    }
)



const maxHeightTransition_js = 300
const maxHeightTransition_css = maxHeightTransition_js/1000 + 's'


// async function toggleSubmenu(target){
function toggleSubmenu(target){
    let submenu = target.nextElementSibling
    let currentAttr = JSON.parse(submenu.getAttribute('visible'))
    submenu.setAttribute('visible', !currentAttr)   //submenu expand
    let contentHeight = submenu.scrollHeight;

    target.setAttribute('opened', !currentAttr)   //sidebar__maj-row background
    let chevron = target.getElementsByClassName('sidebar__icon-chevron')[0]
    chevron.setAttribute('open', !currentAttr)  //chevron rotate
    
    // // for smooth height animation of submenu 
    if (!currentAttr){
        submenu.style.maxHeight = contentHeight + 1 + 'px'
        new Promise(resolve => setTimeout(resolve, maxHeightTransition_js))  // await max-size transition
        submenu.scrollIntoView({ block: "center", behavior: "smooth" })     // scroll submenu to center
    }
    else{
        submenu.style.maxHeight = 0 + 'px'
    }
}
   


</script>


<template>
    <template v-if="menus.length">
        
        <template v-for="(item, index) in menus" :key="index">
                <!-- если есть дети, то добавить класс sidebar__wrap-submenu  -->
                <li  :class="{ 'sidebar__wrap-submenu': item.hasOwnProperty('children') }"> 
                    <a :id="item.id" class="sidebar__row sidebar__row_maj" 
                        @click.prevent="item.hasOwnProperty('children') ? toggleSubmenu($event.currentTarget) : router.push({ name: item.route})"
                        :href="router.resolve({ name: item.route}).fullPath" 
                        
                        >
                    <p 
                        class="sidebar__row-content_maj">
                                <span class="sidebar__1-col"> 
                                    <template v-if="item.col1 != null">
                                            <Svg class="sidebar__icon" :name="item.col1"></Svg> 
                                    </template>
                                </span>

                                <span class="sidebar__2-col">{{item.col2}} </span>

                                <span class="sidebar__3-col">
                                    <template v-if="item.col3 != null">
                                        <Svg class="sidebar__icon" :class="{ 'sidebar__icon-chevron': item.col3.includes('chevron') }" :name="item.col3"></Svg> 
                                    </template>
                                </span>
                        </p>
                    </a>
                    <!-- с детьми -->
                    <ul class="sidebar__submenu" visible="false" v-if="item.children"> 
                        <template v-for="child in item.children">
                            <li  class="sidebar__row sidebar__row_min" >
                                <a 
                                    @click.prevent="child.hasOwnProperty('route') ? router.push({ name: child.route}) : null"
                                    :href="router.resolve({ name: child.route}).fullPath" 

                                    class="sidebar__row sidebar__row-content_min"
                                >
                                        <span class="sidebar__1-col"> 
                                            <template v-if="child.col1 != null">
                                                <Svg class="sidebar__icon" :name="child.col1"></Svg> 
                                            </template>
                                        </span>
                                        <span class="sidebar__2-col">{{child.col2}} </span>
                                        <span class="sidebar__3-col" > 
                                            <template v-if="child.col3 != null">
                                                <Svg class="sidebar__icon" :name="child.col3"></Svg> 
                                            </template>
                                        </span>
                                </a>
                            </li>
                        </template>
                    </ul>

                </li>
        </template>
    </template>
</template>





<style lang="sass" scoped>
@import '@assets/main'

$transition__max-height--sidebar__submenu: v-bind('maxHeightTransition_css')

// icons
.sidebar__icon
    // common
    transition: fill .2s
    fill: $clr__text--sidebar__row

// rows
.sidebar__wrap-submenu
    // common
    background: $bg--left-part-submenuImp
    // childs
    .sidebar__submenu
        // positions
        margin-left: $mg-left--sidebar__submenu
        // common
        background: $bg--submenu //submenu bg
        transition: max-height $transition__max-height--sidebar__submenu ease
        overflow: hidden
        &[visible=true]
            max-height: 100vh   //random size, this will be redefined
        &[visible=false]
            max-height: 0


.sidebar__row
    text-decoration: none
    // type
    display: flex
    // common
    transition: border-left .3s
    transition: color .2s
    // border-left: $size__border-left--sidebar solid transparent
    color: $clr__text--sidebar__row  //text color
    &:hover
        // border-left: $size__border-left--sidebar solid white
        color: $clr__text_active--sidebar__row
        .sidebar__icon
            fill: $clr__text_active--sidebar__row
    // childs
    & *     //sidebar__row-content, sidebar__(1, 2, 3)-col   
        display: flex 
        flex-shrink: 0  //чтобы не ужималась, если добавлено следом несколько слов
        align-items: center
    &.sidebar__row_maj
        // text-decoration: none
        // size
        height: $height--sidebar__maj-row
        // common
        font-size: $font-size--sidebar__maj-row
        background: $bg--sidebar
        transition: background .1s
        &[opened=true]
            background: $bg--sidebar__row_hover
            // & .sidebar__row-content_maj
            //     &:hover
            //         border-left: $size__border-left--sidebar solid transparent  // отключить выделение если строка открыта
        &:hover
            background: $bg--sidebar__row_hover
        &:active
            top: 2px
            left: 1px
            box-shadow: none


        & .sidebar__row-content_maj    // border left setted in this place       
            // type
            flex-grow: 1
            flex-shrink: 1
            overflow-x: hidden
            // overflow-x: hidden
            // size
            border-left: $size__border-left--sidebar solid transparent
            // position
            gap: $gap--sidebar
            padding-left: $pd-left--sidebar__row-content
            padding-right: $pd-right--sidebar__row-content
            // commons
            &:hover
                border-left: $size__border-left--sidebar solid white

            // childs
            .sidebar__1-col
                // size
                width: $width--sidebar__icon
            .sidebar__3-col

                // position
                margin-left: auto
                // common
                transition: background .3s
                border-radius: 1rem
                // background: $bg--icon-chevron_active_true
                &:active
                    opacity: .3
                &:hover
                    background: $bg--icon-chevron_active_true
                & .sidebar__icon-chevron
                    // size
                    width: $width__icon_chevron
                    // common
                    transition: transform $transition__max-height--sidebar__submenu
                    &[open=true]
                        transform: rotate(-180deg)
                    &[open=false]
                        transform: rotate(0deg)

    &.sidebar__row_min 
        // size
        height: calc($height--sidebar__min-row - $size__border-bottom--sidebar__min-row)
        border-bottom: $size__border-bottom--sidebar__min-row solid black
        font-size: $font-size--sidebar__min-row
        // common
        transition: background .1s
        &:hover
            background: $bg--sidebar__row_hover
        // childs
        & .sidebar__row-content_min    // border left setted in this place
            // text-decoration: none
            // color: white
            // type
            flex-grow: 1
            flex-shrink: 1
            overflow-x: hidden
            // size
            border-left: $size__border-left--sidebar solid transparent
            // position
            gap: $gap--sidebar
            padding-left: $pd-left--sidebar__row-content
            padding-right: $pd-right--sidebar__row-content
            &:hover            
                border-left: $size__border-left--sidebar solid white
            .sidebar__1-col
                // type
                // flex-shrink: 0  //чтобы не ужималась, если добавлено следом несколько слов
                // size
                width: $width--sidebar__icon

    



</style>

