import { defineStore } from 'pinia'
import { info } from 'sass'
import { ref, computed,watch } from 'vue'

// !!! for multiple snackbox

// const messages = {
//   // "Ошибка при получении данных"
//   // "Данные были изменены"
// }

const colors = {
    success:  '#198754',
    info: '#0dcaf0',
    warning: '#ffc107',
    error: '#dc3545'
}
/*
types: [success, info, warning, error]
*/


export const useSnackbarStore = defineStore('snackbar', () => {
    
    const status = ref(false)
    const message = ref('Сообщение по-умолчанию')
    
    const typeColor = ref('info')  //default type
    const color = computed(() => colors[typeColor.value])
    
    function hide() {
      status.value = false
    }
    function show() {
      status.value = true
    }
    function changeType(newType) {
      // console.log(newType)
      typeColor.value = newType
    }

    // it works
    watch(
      status,
      (newStatus) => {
        if(newStatus==true){

          setTimeout(()=>{
            // console.log('timer on')
            status.value = false
           },3000)
        }
      }
    )

  
    return { status, message, color, hide, show, changeType }
  })