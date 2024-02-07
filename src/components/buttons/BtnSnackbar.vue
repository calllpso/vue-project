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
    color: white
    cursor: pointer
    user-select: none
    transition: all .15s
    padding: 0.125rem .25rem 0.125rem .25rem    
    .btn__text
        display: flex
    &:hover
        color: black
    &:active
        transform: scale(0.95)
        


</style>

