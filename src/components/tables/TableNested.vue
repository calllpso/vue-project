<script setup>
import Svg from '@components/Svg.vue';

const props = defineProps({
    data: null,
})



</script>



<template>
    <div class="custom-table" v-if="data!=null">
        <main class="main-nested" ref="tableRef">
            <table>
                <thead>
                    <tr>
                        <template v-for="(head, key) in data.thead">
                            <th class="main__th" @click="data.setSort(key)">
                                <div class="th__content" >
                                    <span> {{ head.value }} </span>
                                    
                                    <Svg class="th__icon" 
                                    :class="{
                                        visible: head.sort !=null, 
                                        rotate: head.sort == 'desc'
                                    }"
                                    :name ="'arrow-up'" ></Svg>
                                </div>
                            </th>
                        </template>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="(row, index) in data.tbody">

                            <tr :id="`${row.service.id}row`">
                                <template v-for="field, key in row.common">
                                    <!-- columns -->
                                    <!-- serialize value -->
                                    <template v-if="data.thead[key].serializeFunction == undefined">
                                        <td class="child-td"> {{field}} </td>
                                    </template>
                                    <template v-else>
                                        
                                        <td class="child-td time-td">
                                            <!-- {{ data.thead[key].serializeFunction(field) }} -->
                                            <template v-if="typeof(data.thead[key].serializeFunction(field)) != 'object'">
                                                    {{ data.thead[key].serializeFunction(field) }}
                                            </template>
                                            <template v-else>
                                                <template v-for="data in data.thead[key].serializeFunction(field)">
                                                    {{ data }}
                                                    <br>
                                                </template>
                                            </template>
                                        </td>
                                    </template>
                                    
                                </template>

                            </tr>


                    </template>
                
                </tbody>
            </table>
        </main>
    </div>
</template>

<style lang="sass" scoped>
$height__row: 3rem
$height__headerFooter: 2rem



.custom-table
    width: 100%
    min-width: min-content

.main-nested
    overflow-y: auto
    width: 100%
    max-height: 100%
    max-height: calc(100% - 2* $height__headerFooter)

    table
        width: 100%
        border-collapse: collapse
        
        background: white
        thead    
            user-select: none
            cursor: pointer
            top: 0
            color: #0a466a
            tr
                height: $height__row

                font-weight: 600
                // border-bottom: 2px solid
                // border-color: #0a466a91
                th
                    font: unset
                    width: 9rem
                    &:first-child 
                        padding-left: 1rem
                    &:hover 
                        .th__icon:not(.visible)
                            opacity: 0.5
                    .th__content
                        display: flex
                        gap: .25rem
                    .th__icon
                        // fill: black
                        opacity: 0
                        width: 1.25rem
                        transition: all .18s
                        &.visible
                            opacity: 1
                        &.rotate
                            transform: rotate(180deg)
        tbody
            tr
                height: $height__row
                // &:nth-child(2n)
                //    background: #bebebe
                td 
                    &:first-child 
                        padding-left: 1rem
                .actions
                    display: flex
                    gap: .5rem
                    .th__icon
                        width: 1.5rem
                        fill: black
header
    height: $height__headerFooter
    top: 0
    left: 0
    user-select: none
    .header__input
        background: white
        width: 30%
        min-width: min-content
        height: 100%
    
 

.icon
    width: 1.5rem
    fill: black

    
</style>
