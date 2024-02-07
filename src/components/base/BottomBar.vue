<script setup>
const props = defineProps({
    balance: null,
    statusData: Object
})


</script>

<template>
    <nav class="bottombar">
            <div class="bottombar__item bottombar__developed" >
                <span class="col-1">
                    Разработчик:
                </span>
                <span class="col-2">
                    
                </span>
            </div>    
            <div class="bottombar__item bottombar__balance">
                <span class="col-1">
                    Баланс:
                </span>
                <span class="col-2">
                    <template v-if="balance!=null">

                        {{ balance }} рублей
                    </template>
                    <template v-else>
                        <span class="bottombar__balance_error">
                            ошибка
                        </span>
                        
                    </template>
                </span>
            </div>    
            <div class="bottombar__item bottombar__phone">
                <span class="col-1">
                    Телефон тех.поддержки:
                </span>
                <span class="col-2">
                    xxxxx
                </span>
            </div>    
            <div class="bottombar__item bottombar__status">
                <span class="col-1">
                    Статус:
                </span>
                <span class="col-2">
                    <template v-if="statusData">
                        <span :class="statusData.status ? 'ok' : 'error' ">
                            <template v-if="statusData.status">
                                {{ statusData.message }}
                            </template>
                            <template>
                                {{ statusData.message }}
                            </template>
                        </span>
                    </template>
                </span>
            </div>   
    </nav>
</template>

<style lang="sass" scoped>
@import '@assets/main'

.bottombar
    // type
    display: flex
    // size
    height: 2rem
    // position 
    align-items: center
    margin-left: 1rem
    margin-right: 1rem
    gap: 1rem
    // common
    user-select: none
    color: #c1c1c1
    // childs
    .bottombar__item
        display: flex
        justify-content: center
        flex-shrink: 0
        flex-grow: 1
        gap: .5rem
        width: auto

        &.bottombar__balance
            .col-2
                .bottombar__balance_error
                    color: red
        &.bottombar__status
            .col-2
                .ok
                    color: #00e800
                .error
                    color: red
        &.bottombar__lists
            .col-2
                color: #00e800
        
        

</style>