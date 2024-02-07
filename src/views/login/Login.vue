<script setup>
import { ref } from 'vue';

import Card from '@components/cards/Card.vue'
import {LoginForm} from '@classes/forms'

import {AuthData} from '@classes/data'

import router from '@router/index'


import { useAuthStore } from '@/stores/auth'
import { useApiRoutesStore } from '@/stores/apiroutes'
import { useRestStore } from '@/stores/rest'

const authStore = useAuthStore()
const apiroutesStore = useApiRoutesStore()
const restStore = useRestStore()


// login
const loginForm = ref(new LoginForm())
async function get_callback(){
    let response = await restStore.POST(apiroutesStore.routes.login.base, loginForm.value.toApi_post())
    if (response){
        // await setToken(response)
        
        let authdata = new AuthData(response)
        authStore.setToken(authdata.token)
        authStore.setRole(authdata.role)

        // next route after auth
        router.push({ name: 'employees'})

    }
}

</script>


<template>
    <div class="container">
        <Card class="login-form" :dataFields="loginForm"
        :btnApplyName="'Войти'"
        @callback="get_callback()"
        ></Card>
    </div>
</template>




<style lang="sass" scoped>
.container
    box-sizing: border-box
    padding: 1rem
    width: 100%
    display: flex
    justify-content: center
    padding-top: 15%
    height: 100%

    .login-form
        width: 20rem
    

</style>
