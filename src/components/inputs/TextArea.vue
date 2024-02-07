<script setup>

const props = defineProps({
    value: String,
    cssStyle: String,
    disabled: Boolean,
})

const emits = defineEmits(['callback'])
const onInput = (event) => {
  emits('callback', event.target.value)
}
</script>

<template>

    <textarea class="text-area__input" 
        placeholder="Текст сообщения" 
        :value="value" 
        @input="onInput"
        :class="cssStyle"
        :disabled="disabled"
        >
</textarea>

</template>

<style lang="sass" scoped>
@import '@assets/main'
.required-error
    border: 1px solid !important
    border-color: red !important

.text-area__input
    all: unset
    resize: vertical
    min-height: 3rem
    height: 7rem
    max-height: 20rem
    width: 100%
    border: 1px solid #bebebe
    transition: background .05s
    background: #f3f3f3
    padding: .5rem
    &:focus
        background: white
</style>
