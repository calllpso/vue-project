import { useRoute } from 'vue-router';
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'


const routeTitleMap ={                      
    'home'               :  'home',           
    'login'              :  'Авторизация',           
    'employees'          :  'Сотрудники',               
    'employees-create'   :  'Добавить сотрудника',                       
    'employees-update'   :  'Обновить сотрудника',                       
    'lists'              :  'Списки' ,           
    'lists-create'       :  'Добавить список',                   
    'lists-update'       :  'Обновить список',                   
    'position'           :  'Должности',               
    'division'           :  'Подразделения',               
    'audio'              :  'Аудиофайлы',           
    'audio-create'       :  'Добавить Аудиофайл',                   
    'audio-update'       :  'Обновить Аудиофайл',                   
    'reports'            :  'Отчеты'  ,               
    'reports-detail'     :  'Подробный отчет',                       
}

const routeBtnMap ={                      
    'home'               :  null,           
    'login'              :  null,           
    'employees'          :  'Добавить',               
    'employees-create'   :  null,                       
    'employees-update'   :  null,                       
    'lists'              :  'Добавить' ,           
    'lists-create'       :  null,                   
    'lists-update'       :  null,                   
    'position'           :  'Добавить',               
    'division'           :  'Добавить',               
    'audio'              :  'Добавить',           
    'audio-create'       :  null,                   
    'audio-update'       :  null,                   
    'reports'            :  null,
    'reports-detail'     :  'Печать',
}


export const useTopbarStore = defineStore('topbar', () => {
    const route = useRoute()

    const title = computed(() => {
        // console.log(route.name)
        for(let key in routeTitleMap) {
            if(route.name == key ){
                return routeTitleMap[key]}
            }
    })  

    const btnName = computed(() => {
        // console.log(route.name)
        for(let key in routeBtnMap) {
            if(route.name == key ){
                return routeBtnMap[key]}
            }
    })  
    
    // (refFunction,param){

    const btnFunction = ref(null)

    function setbtnFunction(fn, ...params){
        btnFunction.value = () => fn(...params)
    }

    return { title,btnName, btnFunction, setbtnFunction }
  })