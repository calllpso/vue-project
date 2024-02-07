
<template>
    <aside class="sidebar-shadow" :expand="pinSideBar"></aside>
    <aside ref="sidebar" class="sidebar" :expand="pinSideBar" @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter" >
        <div class="sidebar__header">
                <Svg class="sidebar__logo-icon" name="phone" @click="router.push({ name: 'home'}) "> </Svg> 
                <span class="sidebar__logo-text"> PereZvonar </span>
                <span class="sidebar__logo-pin" @click="togglePinSideBar"> 
                    <svg v-if="pinSideBar" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path d="M2 5.27L3.28 4L20 20.72L18.73 22L12.8 16.07V22H11.2V16H6V14L8 12V11.27L2 5.27ZM16 12L18 14V16H17.82L8 6.18V4H7V2H17V4H16V12Z" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z"/>
                    </svg>
                </span>
        </div>

        <ul class="sidebar__nav sidebar__nav_position_up">
            <SideBarNav :collapsedSideBar="collapsedSideBar" :pinSideBar="pinSideBar" :menus="refmenuUp"/>
        </ul>

        <ul class="sidebar__nav sidebar__nav_position_down">
            <SideBarNav :collapsedSideBar="collapsedSideBar" :pinSideBar="pinSideBar" :menus="menuDown"/>
        </ul>

        
    </aside>
    
    </template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Svg from '@components/Svg.vue';

import SideBarNav from '@components/base/SideBarNav.vue'

import router from '@router/index'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'


const authStore = useAuthStore()
const { role } = storeToRefs(authStore)


const sidebar = ref(null)

const pinSideBar = ref(false)
const collapsedSideBar = ref(null)


const handleMouseLeave = () => {
    if (!pinSideBar.value){
        collapsedSideBar.value = true
    }
};

// свернуть если не нажат pin и нет hover
const handleMouseEnter = () => {
    collapsedSideBar.value = false
}

function togglePinSideBar(){
    pinSideBar.value = !pinSideBar.value
}


const menuUp = [
    {
        id: 'menu__alert' , 
        col1: 'email',    col2:	'Оповещения',  col3: 'chevron-down',
        allowedRole:  ['Admin', 'Manager', 'User',],
        children: [
            { col1: 'list-box',      col2: 	'Списки',       route: 'lists',   allowedRole:  ['Admin', 'User',],      },        
            { col1: 'file-chart',       col2:	'Отчеты',       route: 'reports', allowedRole:  ['Admin', 'User'], },    
            { col1: 'playlist-music',   col2:	'Аудиофайлы',   route: 'audio',   allowedRole:  ['Admin'],          },    
        ]
    },
    { col1: 'account-tie',      col2:	'Сотрудники',     route: 'employees', allowedRole:  ['Admin'],   },
    { col1: 'briefcase',        col2:	'Должности',      route: 'position' , allowedRole:  ['Admin'],   },
    { col1: 'sitemap',          col2:	'Подразделения',  route: 'division' , allowedRole:  ['Admin',],   },
]



const menuDown = ref([{ col1: 'logout', col2:	'Войти', route: 'login'},])


function setLoginMenuIcon(currentRole){
    // console.log(currentRole)
    if(currentRole==null){
        menuDown.value=[]
        menuDown.value=[{ col1: 'login', col2:	'Войти', route: 'login'},]
    }
    else{
        menuDown.value=[]
        menuDown.value=[{ col1: 'logout', col2:	'Выйти', route: 'login'},]
    }
    
}
setLoginMenuIcon(role.value)


watch(
    role,
      (newRole) => {
        hideMenuItemsFromRole(newRole)
        setLoginMenuIcon(newRole)
      }
    )


const refmenuUp = ref([])

function hideMenuItemsFromRole(currentRole){
    refmenuUp.value = []
    menuUp.forEach((item)=>{
        if(item.allowedRole.includes(currentRole)){
            refmenuUp.value.push(item)
        
            // childrens
            if(item.children){
                let lastIndex = refmenuUp.value.length - 1
                let children = []

                refmenuUp.value[lastIndex].children.forEach((child)=>{
                    if(child.allowedRole.includes(currentRole)){
                        children.push(child)
                    }
                })

                refmenuUp.value[lastIndex].children = children
                // если вложенных списков нет, то удалить родительский
                if(children.length == 0){
                    refmenuUp.value.pop()
                }
            }
        }
    })
}

hideMenuItemsFromRole(role.value)



</script>




<style lang="sass" scoped>
@import '@assets/main'
// 
.sidebar-shadow
    width: $width--sidebar_expand_false
    &[expand=true]
        width: $width--sidebar_expand_true
// sidebar
.sidebar
    // type
    position: fixed
    z-index: 999
    container-type: inline-size
    display: flex
    flex-direction: column
    // size
    transition: width .35s
    width: $width--sidebar_expand_false
    height: 100%
    &:hover
        width: $width--sidebar_expand_true
    &[expand=true]
        width: $width--sidebar_expand_true
        position: fixed

    // common
    
    user-select: none
    color: $clr__font--sidebar
    background-color: $bg--sidebar
    overflow-x: hidden
    // common__scrolling
    overflow-y: scroll
    scrollbar-width: none
    &::-webkit-scrollbar 
        display: none

    
    // childs
    .sidebar__nav
        // type
        display: flex
        flex-direction: column

        // common
        cursor: pointer
        
        // childs
        &.sidebar__nav_position_down
            // positions
            margin-top: auto

    // sidebar__header
    .sidebar__header
        // type
        display: flex
        flex-shrink: 0
        container-type: inline-size
        // size
        height: $height--sidebar__header
        font-size: $font-size--sidebar__logo-row
        //position
        align-items: center

        // common
        background: $bg--logo-container
        cursor: pointer
        
        // positions
        gap: $gap--sidebar
        padding-left: $pd-right--sidebar__row-content
    
        // childs
        .sidebar__logo-icon
            flex-shrink: 0
            // size
            width: $width--sidebar__icon
            
        .sidebar__logo-pin
            // type
            display: block
            // size
            
            width: 1.5rem
            height: 1.5rem
            // width: $width__icon_pin
            // height: $width__icon_pin
            
            
            // positions
            padding: $pd--sidebar__pin
            margin-left: auto
            margin-right: $pd-right--sidebar__row-content
            border-radius: 50%
            
            // common
            fill: white
            transition: background .3s
            &:active
                opacity: .3
            &:hover
                background: $bg--sidebar__pin_hover


</style>