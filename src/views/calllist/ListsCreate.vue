<script setup>
import CardList from '@components/cards/CardList.vue'
import TextArea from '@components/inputs/TextArea.vue'
import GridCard from '@components/base/GridCard.vue'

import {ListForm, SMSData} from '@classes/forms'
import { ref, onBeforeMount, watch } from 'vue';
import { useConfirmStore } from '@/stores/confirm'
import { useSnackbarStore } from '@/stores/snackbar'

import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()


const SnackbarStore = useSnackbarStore()
const confirmStore = useConfirmStore()



const listForm = ref(new ListForm())
const smsData = ref(new SMSData())
const smsRequiredStatus = ref(false)

function snackbarActivate(){
    SnackbarStore.changeType('error')
    SnackbarStore.message = "Ошибка при заполнении формы"
    SnackbarStore.show()
}

async function get_callback(){
    let sms_id = null
    let config =  listForm.value.single.id_configuration.object
    if (config.sms){
        listForm.value.single.id_message_text.id = await restStore.POST(apiroutesStore.routes.sms.post.text, listForm.value.toAPI_post_sms())
    }    

    await restStore.POST(apiroutesStore.routes.calllist.post, listForm.value.toAPI_post(sms_id))
    console.log('postt')
}




onBeforeMount(async()=>{
    let audios = await restStore.GET(apiroutesStore.routes.audio.base)
    
    listForm.value.single.id_audio.data = audios

    let configs = await restStore.GET(apiroutesStore.routes.config.get)
    listForm.value.single.id_configuration.data = configs
})

</script>

<template>
    
    <div class="list-container">
    
        <CardList :dataFields="listForm"
        :btnApplyName="'Сохранить'"
        @callback_1="confirmStore.startConfirmFunction(get_callback)"
        :disabledFields="['audio',]"
        ></CardList>

    </div>
</template>