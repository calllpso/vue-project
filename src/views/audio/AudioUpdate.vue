<script setup>
import {ref, onBeforeMount} from 'vue'
import { useRoute } from 'vue-router'
import {AudioForm} from '@classes/forms'
import Card from '@components/cards/Card.vue'
import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
const apiRoutesStore = useApiRoutesStore()
const restStore = useRestStore()


const confirmStore = useConfirmStore()


const route = useRoute()
const audio_id = route.params.id
const audioForm = ref(new AudioForm())
const audioFile = ref(null)


async function get_callback(){
        await restStore.PUT(apiRoutesStore.routes.audio.put, audioForm.value.toAPI_put())
}


onBeforeMount(async()=>{
    // get audio file
    // console.log(audio_id)
    let audio = await restStore.GETFILE(apiRoutesStore.routes.audio.get(audio_id))
    audioFile.value = audio.file

    let data = {
        id: audio_id,
        audio: audio.file,
        filename: audio.filename,
    }
    audioForm.value.fromAPI(data)

    // console.log(audioForm.value.single.audio.value)
})



</script>


<template>
    <Card :dataFields="audioForm"
        :btnApplyName="'Сохранить'"
        @callback="confirmStore.startConfirmFunction(get_callback)"
        :disabledFields="['file',]"
    ></Card>


    
    <!-- <audio 
        class="audio" 
        controls 
        :src="test" 
        type="audio/mpeg"
    ></audio> -->

</template>
