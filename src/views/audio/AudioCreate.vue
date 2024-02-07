<script setup>
import Card from '@components/cards/Card.vue'
import {AudioForm} from '@classes/forms'
import { ref } from 'vue'
import { useConfirmStore } from '@/stores/confirm'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()

const confirmStore = useConfirmStore()

const audioForm = ref(new AudioForm())

async function get_callback(){
        await restStore.POSTFILE(apiroutesStore.routes.audio.base, audioForm.value.toAPI_post())
}

</script>


<template>
    <Card :dataFields="audioForm"
    :btnApplyName="'Сохранить'"
    @callback="confirmStore.startConfirmFunction(get_callback)"
    :disabledFields="['audio',]"
    ></Card>

</template>
