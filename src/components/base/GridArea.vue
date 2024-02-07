<script setup>

const props = defineProps({
  showGrid: Boolean,
  gridArea: String,
  height: String,
  width: String,
  gap: String,
  mg: String,
  pd: String,
  bg_a: String,
  bg_b: String,
  bg_c: String,
  bg_d: String,
})

/*
showGrid    -    показать сетку
gridArea    -   задать области сетки
height      -   высота областей сетки
width       -   ширина областей сетки
gap         -   расстояние между областями сетки
mg          -   margin между областями сетки
pd          -   padding между областями сетки
bg_a, bg_b, bg_c,bg_d - фон областей сетки
*/

</script>


<template>
    <div class="area-grid">
        <div class="area-grid__container" :show-grid="showGrid" >
                <div class="area-grid__a">
                    <slot name="a">    </slot>
                </div>
                <div class="area-grid__b"> 
                    <slot name="b">    </slot> 
                </div>
                <div class="area-grid__c" id="content"> 
                    <slot name="c">    </slot> 
                </div>
                <div class="area-grid__d"> 
                    <slot name="d">    </slot> 
                </div>
        </div>
    </div>
</template>


<style lang="sass" scoped>
    $gridArea: v-bind('gridArea')
    $gap: v-bind('gap')
    $mg: v-bind('mg')
    $pd: v-bind('pd')
    $bg_a: v-bind('bg_a')
    $bg_b: v-bind('bg_b')
    $bg_c: v-bind('bg_c')
    $bg_d: v-bind('bg_d')
    $height: v-bind('height')
    $width: v-bind('width')

    .area-grid
        container-type: inline-size
        // max-height: 100vh
        // overflow: auto
        .area-grid__container 
            min-height: 100vh
            min-width: 100vw
            display: grid
            grid-template-areas: $gridArea
            // grid-template-columns: min-content 1fr 2rem
            grid-template-columns: $width    
            grid-template-rows: $height
            gap: $gap
            $mg: v-bind('mg')
            $pd: v-bind('pd')

            & .area-grid__a
                grid-area: a
                background: $bg_a
                // display: flex
                // align-items: center
                // vertical-align: center

            & .area-grid__b
                grid-area: b
                background: $bg_b
                max-height: 100vh
                max-width: 100vh
            & .area-grid__c
                container-type: inline-size
                grid-area: c
                background: $bg_c
                max-height: calc(100vh - 4rem)
                overflow: auto
                font-size: .8rem
                // overflow: hidden
            
            & .area-grid__d
                grid-area: d
                background: $bg_d
            & .area-grid__a, .area-grid__b, .area-grid__c, .area-grid__d
                flex-direction: column
                
          
            &[show-grid=true]
                background: rgb(237, 237, 237)


</style>