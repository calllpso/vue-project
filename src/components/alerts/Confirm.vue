<script setup>
import Btn from "@components/buttons/Btn.vue"
import { useConfirmStore } from '@/stores/confirm'
import { onMounted, onUpdated, ref } from "vue";
const confirmStore = useConfirmStore()

const btn =ref(null)

const confirmForm =ref(null)


onUpdated( async ()=>{
    if(btn.value){
        btn.value.$el.focus()
    }
})

</script>

<template

>
    <v-dialog
    v-model="confirmStore.isVisible"
    persistent
    max-width="max-content"
    
    >

        <div ref="confirmForm" class="confirm" v-if="confirmStore.isVisible"
        @keyup.esc="confirmStore.setAccept(false)"
        >
            <div class="confirm__info">
                {{confirmStore.message}}
            </div>
            <div class="confirm__buttons">
                <Btn ref="btn" @click="confirmStore.setAccept(true)" class="confirm__buttons_accept">Да</Btn>
                <Btn @click="confirmStore.setAccept(false)" class="confirm__buttons_dismiss">Нет</Btn>
            </div>
        </div>
    </v-dialog>   
</template>

<style lang="sass">
.confirm
    background: #ddd
    padding: 1rem 1.5rem
    width: max-content

    .confirm__info
        display: flex
        justify-content: center
        margin-bottom: 1.5rem
    .confirm__buttons
        display: flex
        justify-content: center
        gap: 2rem
        .confirm__buttons_accept
            background: green
            border-color: green
        .confirm__buttons_dismiss
            background: red
            border-color: red

</style>