<script setup>
// SnackbarStore
import { useSnackbarStore } from '@/stores/snackbar'
import BtnSnackbar from '@components/buttons/BtnSnackbar.vue'
import { watch,ref, onMounted, nextTick, onUpdated } from 'vue';


const SnackbarStore = useSnackbarStore()
const snackbar = ref(null)


onUpdated(()=>{
    if(snackbar.value){
        snackbar.value.style.background = SnackbarStore.color
    }
})


</script>

<template>
    
    <Teleport to="body" v-if="SnackbarStore.status">
        <div ref="snackbar" class="snackbar" >
            <div class="snackbar__content">
                <div class="snackbar__text">
                    {{ SnackbarStore.message }}
                </div>
                <div class="snackbar__btn">
                    <BtnSnackbar @click="SnackbarStore.hide()">X</BtnSnackbar>
                </div>
                
            </div>
        </div>
    </Teleport>
</template>

<style lang="sass">
.snackbar
    color: white
    width: 30%
    position: fixed
    right: 0
    bottom: 0
    background: #ddd
    z-index: 10000
    border-radius: 6px
    opacity: .9
    .snackbar__content
        display: flex
        width: 100%
        padding: .5rem
        gap: 1rem
        .snackbar__icon
            display: flex
        .snackbar__text
            display: flex
        .snackbar__btn
            margin-left: auto
</style>