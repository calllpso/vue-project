<script setup>
import { defineAsyncComponent, onMounted, onUpdated } from 'vue';



const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

const emits = defineEmits(['mounted'])

const icon = defineAsyncComponent( () =>
    import(`@assets/icons/${props.name}.svg`)
)
</script>

<template>
<component :is="icon" />

</template>