<script>
</script>

<template>
    <button class="btn">
        <span class="btn__text">
            <slot></slot>
        </span>
    </button>
</template>

<style lang="sass" scoped>
@import '@assets/main'
.btn
    font-size: .875rem
    background: #0275b8
    color: white
    border: 1px solid #0275b8
    cursor: pointer
    user-select: none
    transition: all .15s
    border-radius: 5px
    padding: 0.125rem .25rem 0.125rem .25rem    
    .btn__text
        display: flex
    &:hover
        background: #005f97
        border: 1px solid #005f97
    &:active
        transform: scale(0.95)
        background: #005384
        border: 1px solid #005384
        


</style>

