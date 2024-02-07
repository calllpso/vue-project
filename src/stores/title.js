import { useRoute } from 'vue-router';
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'


export const useTitleStore = defineStore('title', () => {
    const route = useRoute()
    // const addTitle = ref(null)

    const routeMap ={
        '/lists'     :'Списки'       ,             
        '/reports'   :'Отчеты'       ,             
        '/audio'     :'Аудиофайлы'   ,                 
        '/employees' :'Сотрудники'   ,                 
        '/position'  :'Должности'    ,             
        '/division'  :'Подразделения',                 
        '/login'     :'Авторизация'        ,         
    }

    const routeTitle = computed(() => {
        for(let key in routeMap) {
            if(route.path.includes(key)){
                return routeMap[key]}
            }
            
        }
        )  
    const title = ref(null)
  
    watch(
        routeTitle,
        (newRouteTitle) => {
            title.value=newRouteTitle
        }
      )
    return { title, routeMap }
  })