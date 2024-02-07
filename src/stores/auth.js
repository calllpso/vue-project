import { defineStore } from 'pinia'

import { ref, computed, watch } from 'vue'


export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'))
    const role = ref(localStorage.getItem('role'))

    function setRole(value){
      role.value = value
      localStorage.setItem('role', value)
      // console.log('set', role.value)
    }

    function setToken(value){
      token.value = `Bearer ${value}`
      localStorage.setItem('token', token.value)
    }

    function removeAuthData(){
      token.value = null
      localStorage.removeItem("token")

      role.value = null
      localStorage.removeItem('role')
      // console.log('remove', role.value)
    }

    function roleMatching(roleArray){
      return roleArray.includes(token.value)
    }

    return { token, role, setToken, removeAuthData, setRole }
  })

  // allowedRole:  ['Admin', 'Manager', 'User', Guest]


 
