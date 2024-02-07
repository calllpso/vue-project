<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    dialog: false,
})




</script>

<template>
    <template >

        <Teleport to="body">
            <!-- @click="dialog=!dialog" -->
            <div v-if="dialog" class="dialog"  >
                <!-- <div class="myDialog__content">
                    overtext
                </div> -->
            </div>
        </Teleport>
    </template>

</template>

<style lang="sass">

.dialog
      width: 100%
      height: 100%
      background: #ddd
      position: fixed
      z-index: 999
      opacity: .5
// .myDialog__content
//       // этими параметрами управлять позиционированием контента
//       width: 100%
//       height: 50%
//       display: flex
//       align-items: center
//       justify-content: center



</style>