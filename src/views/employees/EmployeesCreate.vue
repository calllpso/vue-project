<script setup>
import Card from '@components/cards/Card.vue'
import GridCard from '@components/base/GridCard.vue'
import {ref, onBeforeMount} from 'vue'
import {EmployeeForm} from '@classes/forms'

import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'
import { useConfirmStore } from '@/stores/confirm'

const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()
const confirmStore = useConfirmStore()

const employeeForm = ref(new EmployeeForm())


async function get_callback(){
        let employeeData = employeeForm.value.toAPI_post()
        // create employee
        let employee_id = await restStore.POST(apiroutesStore.routes.employees.base, employeeData.employee)
        
        // set employee id to phones
        for (let phone_number in employeeData.phones){
            employeeData.phones[phone_number].employee_id = employee_id
        }
        // create phones
        restStore.POST(apiroutesStore.routes.phones.base, employeeData.phones)
}

onBeforeMount(async()=>{
    let divisions = await restStore.GET(apiroutesStore.routes.divisions.base)
    let positions = await restStore.GET(apiroutesStore.routes.positions.base)

    employeeForm.value.single.position.data = positions
    employeeForm.value.single.division.data = divisions

})


</script>

<template>
    <div class="container">

        <GridCard>
            <Card :dataFields="employeeForm"
            :btnApplyName="'Сохранить'"
            @callback="confirmStore.startConfirmFunction(get_callback)"
            ></Card>
        </GridCard>
    </div>
</template>



<style lang="sass" scoped>
.container
    box-sizing: border-box
    padding: 1rem
    width: 100%
    display: flex
    
</style>