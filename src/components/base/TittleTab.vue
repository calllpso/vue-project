<script setup>
import { onUpdated } from 'vue';

const props = defineProps({
    title: 'Loading',
})

onUpdated(()=>{
    document.title= props.title
})

</script>

<template>
</template>