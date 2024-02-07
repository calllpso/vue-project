<script setup>
import { shallowRef, defineAsyncComponent, onBeforeMount, ref } from 'vue';

import { StatusData } from '@classes/data'

// base
import GridArea from '@components/base/GridArea.vue'
import SideBar from '@components/base/SideBar.vue'
import TopBar from '@components/base/TopBar.vue'
import BottomBar from '@components/base/BottomBar.vue'

// components
import TittleTab from './components/base/TittleTab.vue'
import SnackBar from '@components/alerts/SnackBar.vue';
import Confirm from '@components/alerts/Confirm.vue';
import Btn from '@components/buttons/Btn.vue'

// stores
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useSocketStore } from '@/stores/socket'
import { useTitleStore } from '@/stores/title'
import { useTopbarStore } from '@/stores/topbar'


const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const titleStore = useTitleStore()
const socketStore = useSocketStore()
// socket activate
socketStore.start()

const topbarStore = useTopbarStore()






const topBar__title = shallowRef(null)
const topBar__functionalButton = shallowRef(null)

function defineMyComponent(btnComp){
  if (btnComp==null){
    topBar__functionalButton.value = null
  }
  else{
    topBar__functionalButton.value = defineAsyncComponent( () => import(`@components/buttons/${btnComp.name}.vue`))
    topBar__functionalButton.value.click = btnComp.hasOwnProperty('clickHandle') ? btnComp.clickHandle : null
    topBar__functionalButton.value.text = btnComp.text
  }
}





// balance & status
const balance = ref(null)
const statusData = ref(null)
onBeforeMount(async()=>{
  balance.value = await restStore.GET(apiroutesStore.routes.sms.get.balance)
  let statusGet =  await restStore.GET(apiroutesStore.routes.status.get)
  statusData.value =  new StatusData(statusGet)
})

</script>

<template>
    <GridArea
      gridArea='
      "b a a"
      "b c c"
      "b d d"'
      height = "3rem auto 2rem"
      width = "min-content 1fr 2rem"
      bg_a="#0a466a"
      bg_b="#c1c1c1"
      bg_d="#0e354d"
      bg_c="#ececec"
      >

      <template #a>
        <TopBar>
          
          <template #title>
              {{ topbarStore.title }}
          </template>

          <template #right-menu>
            <Btn
              v-if="topbarStore.btnName"
              @click="topbarStore.btnFunction"
            > {{ topbarStore.btnName }} 
            </Btn>
          </template>

        </TopBar>
      </template>


      <template #b>
        <SideBar/>
      </template>

      <template #c>
        <div class="container">
          <RouterView />
        </div>
      </template>


      <template #d>
        <BottomBar 
          :balance="balance"
          :statusData="statusData"
          ></BottomBar>
      </template>

      </GridArea>
      


    <Confirm/>
    <SnackBar/>
    <TittleTab :title="titleStore.title"/>
</template>


<style lang="sass">

@import '@assets/main'
.container
    width: 100%
    // height: 100%
    padding: 1rem
// main
#app
  position: fixed
  z-index: 10



@media print
  @page 
    size: A4
  #app
    display: none

  html
    font-size: 12px
    
  .area-grid__a, .area-grid__b, .area-grid__d, .main__chevron
      display: none !important
    
  .area-grid__c
    display: block !important
    overflow: visible !important
    width: auto
    height: auto
    ::-webkit-scrollbar 
      display: none
    page-break-after: always 



  // не установил display none, потому что тогда появляется scroll-bar
  .header, .footer
    opacity: 0
  
  .icon-chevron
    display: none !important

  .container
    padding: 0
    width: 100%
  .time-td
    width: 15rem
  
  th
    border: 1px solid
    padding-left: 1rem 
  .parent-td
    border: 1px solid
    padding-left: 1rem 
  .child-td
    border: 1px solid
    padding-left: 1rem 
    
</style>

