<script setup>
import Svg from '@components/Svg.vue'

const props = defineProps({
    placeholder: String,
    value: String,
    type: String,
    bg: { type: String, required: false, default: 'white' },
    postIcon: { type: String, required: false, default: null }, 
    disabled: Boolean,
    maxlength: String,
    validate: String
})

const emits = defineEmits(['callback'])

const onInput = (event) => {
    if(props.validate=='digital'){
        event.target.value = digitValidate(event)
    }
    emits('callback', event.target.value)
}

function digitValidate(e) {
    var numberPattern = /\d+/g;
    let res = e.target.value.match(numberPattern )
    if(res!=null){
        return res.join('')
    }
    else{
        return ''
    }
}

</script>

<template>
    <div class="input-wrap">
        <input 
            :type="type" 
            class="input-wrap__input-text" 
            type="text" 
            :placeholder="placeholder" 
            :value="value" 
            @input="onInput"
            :disabled="disabled"
            :maxlength="maxlength"
        >
        <Svg v-if="postIcon" class="input-wrap__icon" :name="postIcon"></Svg>
    </div>
</template>

<style lang="sass" scoped>
$bg: v-bind('bg')

$padding: 0.5rem
.input-wrap
    border-radius: 4px
    background-color: $bg
    display: flex
    height: 2rem
    background: #f1f1f1
    .input-wrap__icon
        // fill: black
        fill: #0a466a5e
        width: 1.75rem

    .input-wrap__input-text
        all: unset
        width: 100%
        padding: 0rem $padding
        border: 1px solid transparent
        transition: border-color .2s

        &[disabled]
            background: #ddd
            cursor: default

        &::-webkit-input-placeholder
            opacity: 0.5
        // &:focus
        //     border: 1px solid #0275b8
</style>

