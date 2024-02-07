<script setup>

</script>

<template>
    <nav class="topbar">
        <div class="topbar__left-menu">
                <slot name="title"></slot>
        </div>
        <div class="topbar__right-menu">
            <slot name="right-menu"></slot>
        </div>
    </nav>
</template>

<style lang="sass" scoped>
@import '@assets/main'

.topbar
    height: 100%
    // type
    display: flex

    flex-shrink: 0
    // position 
    align-items: center
    margin-left: 2.5rem
    margin-right: 1rem
    
    // common
    color: white
    user-select: none
    // childs
    .topbar__left-menu
        // type
        flex-shrink: 0
        // size 
        font-size: 1.5rem
        // position
        margin-right: auto
    .topbar__right-menu
        // type
        flex-shrink: 0
    
        

</style>
