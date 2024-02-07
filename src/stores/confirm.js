import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
    const message = ref('Подтвердите действие')
    const isVisible = ref(false)
    const isAccept = ref(null)  // default

    function setMessage(value){
        message.value = value
    }
    
    function show() {    // bool
        isVisible.value = true
    }
    function hide() {    // bool
        isVisible.value = false
    }

    function setAccept(result) {    // bool
      isAccept.value = result
    }

    function setDefaultMessage(){
        message.value = 'Подтвердите действие'
    }

    async function awaitConfirm() {
        show()
        return new Promise(function(resolve, reject) {
            let timer = setInterval(() => {
                // console.log('timer')
                if(isAccept.value!=null){
                    clearTimeout(timer);
                    resolve(isAccept.value)
                    hide()
                    isAccept.value = null
                }
            }, 100);
        })
    }
    async function startConfirmFunction(refFunction,param){
        let confirmValue = await awaitConfirm()
        
        if(confirmValue){
            refFunction(param)
            return true //добавил для logout
        }
        return false //добавил для logout
    }
 
    return { message, isVisible, setAccept, startConfirmFunction, setMessage,setDefaultMessage }
  })