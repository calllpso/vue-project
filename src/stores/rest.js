import { defineStore } from 'pinia'
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'
import router from '@router/index'

export const useRestStore = defineStore('rest', () => {
    const authStore = useAuthStore()
    const addressStore = useAddressStore()

    // заменил строкой
    // function delAuthData(){
    //     authStore.removeAuthData()
    // }
    
    // function createAbsolutePath(path){
    //     return addressStore.ip_addr + path
    // }

    async function GET(url)
    {
          const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
          }
    
        let response = await fetch(url, { 
            method: 'GET', 
            headers: myHeaders,
            })
    
        let status_code = response.status
        let status_text = response.statusText
        let headers = response.headers
        
        
        // console.log(status_code)
        if (status_code==200){
            let result = await response.json()
            snackbarActivate('get', 'ok', url)
            return result
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else{
            snackbarActivate('get', 'error', url)
            return false    // no auth
        }
    }
    
    async function DELETE(url)
    {
    
        const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
        }
    
        let response = await fetch(url, { 
            method: 'DELETE', 
            headers: myHeaders,
            })
        
        let status_code = response.status
    
        if (status_code==200){
            let result = await response.json()
            snackbarActivate('delete', 'ok', url)
            return result
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
        }
        else{
            snackbarActivate('delete', 'error', url)
            return false    // no auth
        }
    }
    
    // delete json for route employeeListTable
    async function DELETE_BODY(url, body)
    {
    
        const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
          }
    
        let response = await fetch(url, { 
            method: 'DELETE', 
            headers: myHeaders,
            body: JSON.stringify(body)
            })
    
    
        let status_code = response.status
    
        if(status_code==200){
            let result = await response.json()
            snackbarActivate('delete', 'ok', url)
            return true
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else{
            snackbarActivate('delete', 'error', url)
            return false
        }
    
            
    }
    
    
    async function POST(url, body)
    {
        const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
          }
    
        let response = await fetch(url, { 
            method: 'POST', 
            headers: myHeaders,
            body: JSON.stringify(body)
            })
    
        
        let status_code = response.status
        let status_text = response.statusText
        let headers = response.headers
        
    
        if (status_code==200){
            snackbarActivate('post', 'ok', url)
            let result = await response.json()
            return result
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else if(status_code==422){
            snackbarActivate_retry()
            return false
        }
        else{
            snackbarActivate('post', 'error', url)
            return false
        }
    }
    
    async function PUT(url, body)
    {
        // console.log(url)
          const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
          }
    
        let response = await fetch(url, { 
            method: 'PUT', 
            headers: myHeaders,
            body: JSON.stringify(body)
            })
    
        let status_code = response.status
        let status_text = response.statusText
        let headers = response.headers
        
    
        if (status_code==200){
            snackbarActivate('put', 'ok', url)
            let result = await response.json()
            return result
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else if(status_code==422){
            snackbarActivate_retry()
            return false
        }
        else{
            snackbarActivate('put', 'error', url)
            return false
        }
    
    }
    
    async function POSTFILE(url, body)
    {
          const myHeaders = {
            'Charset': 'utf-8',
            'Authorization': authStore.token
          }
        console.log(body)
        let response = await fetch(url, { 
            method: 'POST', 
            headers: myHeaders,
            body: body
            })
    
        let status_code = response.status
        let status_text = response.statusText
        let headers = response.headers
        
        if (status_code==200){
            snackbarActivate('post', 'ok', url)
            let result = await response.json()
            return result
        }   
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else{
            snackbarActivate('post', 'error', url)
            return false
        }
    }
    
    async function GETFILE(url)
    {
          const myHeaders = {
            'Charset': 'utf-8',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authStore.token
          }
    
        let response = await fetch(url, { 
            method: 'GET', 
            headers: myHeaders,
            })
        // return response.blob()
    
        let status_code = response.status
        let status_text = response.statusText
        
        
        if(status_code==200){
            let result = await response.blob()
            let filename = getFilenameFromHeader(response.headers)
            function getFilenameFromHeader(headers){
                let nameWithEncoding = headers.get("content-disposition").split(';')[2]
                let name, encoding
                [encoding, name] = nameWithEncoding.split("''")
                return decodeURIComponent(name)
            }
            return {
                file: URL.createObjectURL(result), 
                filename: filename
            }
            
        }
        else if (status_code==401){
            authStore.removeAuthData()
            snackbarActivateErrorAuth()
            return false
        }
        else{
            // snackbarActivate('get', 'error', url)
            return false
        }
    }

    return { GET, DELETE, DELETE_BODY, POST, PUT, POSTFILE, GETFILE }
  })

// other
import { useSnackbarStore } from '@/stores/snackbar'


function getPath(url){
    const addressStore = useAddressStore()
    let path = (url.split(addressStore.ip_addr+'/'))[1]

    let pathWithParams = path.split('/')

    let resultpath = ''
    resultpath = pathWithParams[0] 
    return resultpath
}

// относится к строковым названиям роутов 
const allowedSnackbarRoutes ={
    delete: {
        ok: {
            employees:          'Сотрудник был удален',
            division:           'Подразделение было удалено',     // divisions
            empposition:        'Должность была удалена',      // positions
            audiomessage:       'Аудио было удалено',         // audio
            calllist:           'Список был удален',      
            employeelisttable:  'Сотрудник был исключен из списка',      
            
            
        },
        error: {
            employees:          'Удаление не удалось',
            division:           'Удаление не удалось',            // divisions     true
            empposition:        'Удаление не удалось',         // positions        true
            audiomessage:       'Удаление не удалось',        // audio             true
            calllist:           'Удаление не удалось',        
            employeelisttable:  'Удаление не удалось',      
        }
    },
    post: {
        ok: {
            employees:          'Сотрудник был добавлен',
            division:           'Подразделение было добавлено',     // divisions
            empposition:        'Должность была добавлена',      // positions
            audiomessage:       'Аудио было добавлено',         // audio
            calllist:           'Список был добавлен',      
            employeelisttable:  'Сотрудник был добавлен в список',      
            sms:                'Сообщение было добавлено',      
            
            
        },
        error: {
            employees:          'Добавление не удалось',
            division:           'Добавление не удалось',            // divisions     true
            empposition:        'Добавление не удалось',         // positions        true
            audiomessage:       'Добавление не удалось',        // audio             true
            calllist:           'Добавление не удалось',        
            employeelisttable:  'Добавление не удалось',  
            sms:                'Добавление не удалось',          
        }
    },
    put: {
        ok: {
            employees:          'Сотрудник был изменен',
            empphones:          'Телефоны были изменены',     // phones
            audiomessage:       'Аудио было изменено',         // audio 
            calllist:           'Список был изменен',      
            
            
        },
        error: {
            employees:          'Изменение не удалось',
            empphones:          'Изменение не удалось',            // phones     true
            audiomessage:       'Изменение не удалось',        // audio             true
            calllist:           'Изменение не удалось',        
        }
    },
    get: {
        ok: {
            startcalllist:           'Список запущен',    
            cancelcalllist:          'Список остановлен',    
        },
        error: {
            startcalllist:           'Не удалось запустить список',        
            cancelcalllist:          'Не удалось остановить список',    
        }
    },
}

// перенести в snackbar
function snackbarColor(status, SnackbarStore){  
    if(status=='ok'){
        SnackbarStore.changeType('success')
    }
    else{
        SnackbarStore.changeType('error')
    }
}

async function snackbarActivate(method, status, url){
    /*
    method: [get, post, put, delete] 
    status: [ok, error]
    url:    [employees, ..., etc]
    */
    const SnackbarStore = useSnackbarStore()
    
    let path = getPath(url)
    
    let message = 'Сообщение не вписано в список'
    try {
        message = allowedSnackbarRoutes[method][status][path]
        // console.log(method,status,path, message)
        if(message!=undefined){
            snackbarColor(status, SnackbarStore)
            SnackbarStore.message = message
            SnackbarStore.show()
        }
    }
    catch{ 
        return false
    }
}

async function snackbarActivate_retry(){
    const SnackbarStore = useSnackbarStore()    
    snackbarColor('error', SnackbarStore)
    SnackbarStore.message = 'Запись уже существует'
    SnackbarStore.show()
}

async function snackbarActivateErrorAuth(){
    router.push({ name: 'login'})
    const SnackbarStore = useSnackbarStore()
    SnackbarStore.changeType('error')
    SnackbarStore.message = "Ошибка Авторизации"
    SnackbarStore.show()
}





