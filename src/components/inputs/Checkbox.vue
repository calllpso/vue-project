<script setup>
import {onBeforeMount, ref, watch} from 'vue'
const props = defineProps({
    val: Boolean,
    autoVal: false
})

const selected = ref(props.val)

const emits = defineEmits(['callback'])
watch(
    () => selected.value,
    (newVal) => {
        emits('callback', newVal)

})


watch(
    () => props.val,
    (newCheck) => {
        selected.value = newCheck
        // console.log('main', newCheck)
})


</script>

<template>
    <input 
        class="my-checkbox" 
        type="checkbox"
        v-model="selected"     
        >

</template>

<style lang="sass" scoped>
.my-checkbox
    width: 1.125rem
    height: 1.125rem
    cursor: pointer
</style>


