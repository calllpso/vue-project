// import {ref, toRaw} from 'vue'
import _ from 'lodash';
import { useSnackbarStore } from '@/stores/snackbar'

const SnackbarStore = useSnackbarStore()

function snackbarActivate(){
    SnackbarStore.changeType('error')
    SnackbarStore.message = "Ошибка при заполнении формы"
    SnackbarStore.show()
}

export class LoginForm {
    constructor() {
        this.head = { text: 'Авторизация' };
        this.single = {
            email:            { id: '', type: 'text',     name: 'Логин',   value: '', }, 
            password:         { id: '', type: 'password', name: 'Пароль',  value: '', },
        }
        this.required = [ 'email', 'password', ]
    }

    checkRequiredIsNotEmpty(){
        let sendStatus = true
        for (let key in this.single){
            
            if(this.required.includes(key)){
                if([null,''].includes(this.single[key].value) ){
                        console.log('here', this.single[key])
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
            }
        }
        return sendStatus
    }

    toApi_post(){
        let sendStatus = this.checkRequiredIsNotEmpty()
        if(sendStatus){

            let apiData = {
                email:      this.single.email.value,
                password:   this.single.password.value
            }
            return apiData
        }
        snackbarActivate()
        return false
    }

}

export class DivisionForm {
    constructor() {
        this.head = { text: 'Подразделение' }
        this.single = {
            parents: { id: '', type: 'autocomplete', input_value: 'division', name: 'Родительское подразделение', value: '', data: null, object: null },
            division: { id: '', type: 'text', name: 'Название подразделения', value: '', object: '', }, //inputDisabled: true 
        }
        this.required =['division']
        this.sendStatus=false
    }

    checkRequiredIsNotEmpty(){
        let sendStatus = true
        for (let key in this.single){
            
            if(this.required.includes(key)){
                if([null,''].includes(this.single[key].value) ){
                        console.log('here', this.single[key])
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
            }
        }
        return sendStatus
    }

    clear(){
        let autocomplete_data = this.single.parents.data
        this.single = {
            parents: { id: '', type: 'autocomplete', input_value: 'division', name: 'Родительское подразделение', value: '', data: autocomplete_data, object: null },
            division: { id: '', type: 'text', name: 'Название подразделения', value: '', object: '' },
        }
    }
    // POST
    toAPI_post(){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        if(this.sendStatus){

            try {
                // console.log(this.single.parents.object)
                let data ={
                    division: this.single.division.value,
                    parent_id: this.single.parents.object == null ? null : this.single.parents.object.id
                }
                return data
            } 
            catch (err) {
                // console.log(err)        
                snackbarActivate()
            }
        }
        this.sendStatus =false
        snackbarActivate()

    }
    // PUT
    toAPI_put(){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        if(this.sendStatus){
            try{
                console.log(this.single)
                let data ={
                    id: this.single.division.id,
                    division: this.single.division.value,
                }

                data.parent_id = (this.single.parents.object !=null) ? this.single.parents.object.id : null

                return data
            }
            catch(err){
                snackbarActivate()
                // console.log(err)
            }
        }
        this.sendStatus =false
        snackbarActivate()
    }

    fromAPI(response){
        // division
        this.single.division.value = response.division
        // id
        this.single.division.id = response.id
        // parent
        let parent_id = response.parent_id        
        if (parent_id!=null){
            this.single.parents.object = _.filter(this.single.parents.data, (division) => {
                return division.id == parent_id
            })[0]
            this.single.parents.value = this.single.parents.object.division
        }
        else{
            this.single.parents.value = null
        }
    } 
}

export class EmployeeForm {
    constructor() {
        this.head = { text: 'Сотрудник' }
        this.single = {
            surname:    { id: '', type: 'text', name: 'Фамилия', value: '' },
            name:       { id: '', type: 'text', name: 'Имя', value: '' },
            second_name:{ id: '', type: 'text', name: 'Отчество', value: '' },
            position:   { id: '', type: 'autocomplete', 
                        name: '*Должность', value: '', 
                        input_value: 'position_name', data: null, 
                        object: null
                    },

            division:   { id: '', type: 'autocomplete', 
                        name: '*Подразделение', value: '', 
                        input_value: 'division', data: null, 
                        object: null },
        }
        this.multiple = [
            {
                id: '',
                type: 'text',
                name: 'Телефон',
                value: '',
                priority: null,
                children: {
                    values: {
                        sms: { type: 'slider', name: 'СМС', icon:'email', value: false },
                        voice: { type: 'slider', name: 'Звонок', icon:'phone-classic', value: true },
                    },
                    other: [
                        // { type: 'icon', icon: 'drag' },
                        { type: 'icon', icon: 'delete' },
                        { type: 'icon', icon: 'arrow-up' },
                        { type: 'icon', icon: 'arrow-down' },
                    ],
                },
            },
        ];
        
        this.required=[ 'surname', 'name', 'second_name', 'position', 'division',]

        this.service = {
            id: null
        }

        this.apiJson={single: {}, multiple: []}
    }
    /*
    0 = null
    1 = Voice
    2 = SMS
    3 = Voice, SMS
    */
    bitView(sms, voice){
        let status = (sms ? 2 : 0) + (voice ? 1 : 0)
        return status
    }
    toBitView(status){
        let voice = (status & 1) !=0    // bit compare
        let sms = (status & 2) !=0      // bit compare
        return [voice, sms]
    }

    checkRequiredIsNotEmpty(){
        let sendStatus = true
        for (let key in this.single){

            if(this.required.includes(key)){
                // object или value используется
                // value
                if(this.single[key].object == undefined){
                    if([null,''].includes(this.single[key].value) ){
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
                }
                // object
                else{
                    if(this.single[key].object==null){
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
                }
            }

        }
        for (let index in this.multiple){
            if([null,''].includes(this.multiple[index].value)){
                this.multiple[index].cssClass='required-error'
                sendStatus=false
            }
            else{
                this.multiple[index].cssClass=''
            }
        }
        return sendStatus
    }

    toAPI_post(){
        let sendStatus = this.checkRequiredIsNotEmpty()
        if(sendStatus){

            try {
                let employee ={
                    surname: this.single.surname.value,
                    name:   this.single.name.value,
                    second_name:    this.single.second_name.value,
                    division_id: this.single.division.object.id,
                    position_id: this.single.position.object.id,
            }

            let phones = []
            for (let phone_key in this.multiple){
                let phone = {
                    priority: phone_key,
                    phone: this.multiple[phone_key].value,
                    status: this.bitView(this.multiple[phone_key].children.values.sms.value,  this.multiple[phone_key].children.values.voice.value)
                }
                phones.push(phone)
            }

            let data = {
                employee: employee,
                phones: phones
            }
            
            // console.log(data)
            return data
            } 
            catch (err) {
                // alert('должность и подразделение должны быть заполнены')     
                snackbarActivate()   
                // console.log(err)        
            }
        }
        snackbarActivate()
        return false //если ошибка
    }

    toAPI_put(){
        let sendStatus = this.checkRequiredIsNotEmpty()
        if(sendStatus){
            try {
                // console.log(this.service.id,)
                let employee ={
                    id: this.service.id,
                    surname: this.single.surname.value,
                    name:   this.single.name.value,
                    second_name:    this.single.second_name.value,
                    division_id: this.single.division.object.id,
                    position_id: this.single.position.object.id,
                }

                let phones = []
                for (let i in this.multiple){
                    let phone = {
                        id: this.multiple[i].id,
                        employee_id: this.service.id,
                        priority: i,
                        phone: this.multiple[i].value,
                        status: this.bitView(this.multiple[i].children.values.sms.value,  this.multiple[i].children.values.voice.value)
                    }
                    phones.push(phone)
                }
                let data = {
                    employee: employee,
                    phones: phones
                }
                return data
            } 
            catch (err) {
                snackbarActivate()
            }
        }
        snackbarActivate()
        return false
    }

    
    fromAPI(r_employee, r_phones){
        // console.log(r_employee)
        try {
            // SINGLE DATA
            this.service.id = r_employee.id
            this.single.surname.value = r_employee.surname
            this.single.name.value = r_employee.name
            this.single.second_name.value = r_employee.second_name
            // set position
            this.single.position           
            // set position
            this.single.position.object = _.filter(this.single.position.data, (position) => {
                return position.id == r_employee.position_id
            })[0]
            if(this.single.position.object!=undefined){
                this.single.position.value = this.single.position.object[this.single.position.input_value] 
            }
            // set divison
            this.single.division.object = _.filter(this.single.division.data, (division) => {
                return division.id == r_employee.division_id
            })[0]
            if(this.single.division.object!=undefined){
                this.single.division.value = this.single.division.object[this.single.division.input_value] 
            }

            // MULTIPLE DATA
            // !!! требуется сортировка по возрастанию priority
            this.multiple = []
            for (let i in r_phones){
                // console.log(r_phones[i])
                let [voice, sms] = this.toBitView(r_phones[i].status)
                let entry ={
                    id: r_phones[i].id,
                    employee_id: r_phones[i].employee_id,
                    type: 'text',
                    name: 'Телефон',
                    value: r_phones[i].phone,
                    priority: r_phones[i].priority,
                    children: {
                        values: {
                            sms: { type: 'slider', name: 'СМС', icon:'email', value: sms },
                            voice: { type: 'slider', name: 'Звонок', icon:'phone-classic', value: voice },
                            // voice: { type: 'slider', name: 'Звонок', icon:'telephone', value: voice },
                        },
                        other: [
                            // { type: 'icon', icon: 'drag' },
                            { type: 'icon', icon: 'delete' },
                            { type: 'icon', icon: 'arrow-up' },
                            { type: 'icon', icon: 'arrow-down' },
                        ],
                    },
                }
                this.multiple.push(entry)
            }
        }
        catch(e){
            snackbarActivate()
        }
    }

}

export class PositionForm {
    constructor() {
        this.head = { text: 'Должность' }
        this.single = {
            position_name: { id: '', type: 'text', name: 'Название должности', value: '', object: '' },
        }
        this.service = {
            id: null,
        }
        this.required = [ 'position_name' ]
        this.sendStatus=true
    }

    checkRequiredIsNotEmpty(){
        let sendStatus = true
        for (let key in this.single){
            
            if(this.required.includes(key)){
                if([null,''].includes(this.single[key].value) ){
                        console.log('here', this.single[key])
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
            }
        }
        return sendStatus
    }

    clear(){
        // let autocomplete_data = this.single.parents.data
        this.single = {
            position_name: { id: '', type: 'text', name: 'Название должности', value: '', object: '' },
        }
    }
    // POST
    toAPI_post(){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        if(this.sendStatus){

            try {
                let data ={
                    position_name: this.single.position_name.value,
                }
                // console.log(data)
                return data
            } 
            catch (err) {
                snackbarActivate()
                // console.log(err)        
            }
        }
        snackbarActivate()
        this.sendStatus=false
        return false
    }

    // // PUT
    toAPI_put(){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        if(this.sendStatus){
            try{
                let data ={
                    id: this.service.id,
                    position_name: this.single.position_name.value,
                }
                return data
            }
            catch(err){
                // console.log(err)
                snackbarActivate()
            }
        }
        snackbarActivate()
        this.sendStatus=false
        return false
    }

    fromAPI(response){
        // division
        this.single.position_name.value = response.position_name
        this.service.id = response.id
        console.log(this)
    } 
}

export class AudioForm {
    constructor() {
        this.head = { text: 'Аудио' }
        this.single = {
            filename: { id: '', type: 'text', name: 'имя', value: '' },
            file:  { id: '', type: 'file', name: 'Файл', value: '', file: null },
            audio:  { id: '', type: 'audio', name: 'аудио', value: '', file: null },
        }
        this.service = {
            id: null,
        }
        this.apiJson={single: {}}
    }
    toAPI_post(){
        try {
            let file = new FormData()
            // change name
            if(this.single.filename.value.length!=0){
                file.append('file', this.single.file.value, this.single.filename.value)  
            }
            else{
                file.append('file', this.single.file.value)  
            }
            return file
        } 
        catch (err) {
            // console.log(err)        
            snackbarActivate()
        }
    }
    
    // POST
    toAPI_put(){
        try {
            // console.log(this.single.audio.value)
            let file_prev = new FormData()
            // change name
            file_prev.append('file', this.single.file.value, this.single.filename.value)  
            // file_prev.append('file', this.single.file.value)  

            console.log(this.single.audio)
            // let file_null = new FormData()
            // file_null.append('file', this.single.file.value, this.single.filename.value)

            // let data = {
            //     id: this.service.id,
            //     filename: this.single.filename.value,
            //     file: ''
            // }

            let data = {
                id: 147,
                file: "string",
                filename: "string"                 
            }

            return data
        } 
        catch (err) {
            snackbarActivate()
            // console.log(err)        
        }
    }

    fromAPI(response){
        // console.log(response.audio)
        this.service.id = response.id
        this.single.filename.value = response.filename
        this.single.audio.value = response.audio
    }
}

export class SMSData {
    constructor() {
        this.data = {
            id: null,
            message_text: null
        }
    }
    clearData(){
        this.data = {
            id: null,
            message_text: null
        }
    }
 
    // POST
    toAPI_post(){
        let data = {
            message_text: this.data.message_text
        }
        return data
    }
    
}

export class ListForm {
    constructor() {
        this.head = { text: 'Список' };
        this.single = {
            numlist:       { id: '', type: 'text', name: 'Номер списка',       value: '', }, 
            namelist:       { id: '', type: 'text', name: 'Название',       value: '', }, 
            status:         { id: '', type: 'slider', name: 'Статус',         value: null, },
            id_audio:   { id: '', type: 'autocomplete', name: 'Аудио', value: null,  input_value: 'filename', data: null, object: null, },
            id_configuration: { id: '', type: 'autocomplete', name: 'Конфигурация', value: null, input_value: 'name', data: null, object: null, },
            id_message_text: {value: null, id:null,  text: '' },
        };
        this.service = {
            id: null,
        }
        this.required=['numlist','namelist', 'id_configuration', 'id_audio']

        this.sendStatus=false

        this.mapStatus={
            true: 'Запущен',
            false: false,
            null: false,
        }
    }

    clearSms(){
        this.single.id_message_text = {value: null, id:null,  text: '' }
    }

    
    checkRequiredIsNotEmpty(){
        let sendStatus = true
        for (let key in this.single){
            if(this.required.includes(key)){
                // object или value используется
                // value
                if(key=='numlist'){
                    if([null,''].includes(this.single.numlist.value) ){
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
                }

                if(key=='namelist'){
                    if([null,''].includes(this.single.namelist.value) ){
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
                }

                if(key=='id_configuration'){
                    if(this.single.id_configuration.object == null){
                        this.single[key].cssClass='required-error'
                        sendStatus=false
                    }
                    else{
                        this.single[key].cssClass=''
                    }
                }
                if(key=='id_audio'){
                    if(this.single.id_configuration.object !=null){
                        if(this.single.id_configuration.object.voice){
                            // if()
                            if(this.single.id_audio.object == null){
                                this.single[key].cssClass='required-error'
                                sendStatus=false
                            }
                            else{
                                this.single[key].cssClass=''
                            }
                        }
                    }
                }
                
            }

        }
        return sendStatus
    }

    checkReqSmsIsNotEmpty(){
        if([null, ''].includes(this.single.id_message_text.value)){
            this.single.id_message_text.cssClass='required-error'
            return false            
        }
        else{
            this.single.id_message_text.cssClass=''
            return true
        }
    }

    toAPI_post_sms(){
            let sendStatus = this.checkReqSmsIsNotEmpty() 
            if (sendStatus){
                let data = {
                    message_text: this.single.id_message_text.value
                }
                return data
            }
            else{
                snackbarActivate()
            }

    }


    toAPI_post(){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        if(this.sendStatus){
            try {
                let data ={
                    numlist: Number(this.single.numlist.value),
                    namelist: this.single.namelist.value,
                    status:   false, //not using in back but it's required
                    id_configuration: this.single.id_configuration.object.id,
                    id_message_text: this.single.id_message_text.id
                }

                let config = this.single.id_configuration.object
                

                // voice
                data['id_audio'] = config.voice ? this.single.id_audio.object.id : null
               
                return data
                
            } 
            catch (err) {
                console.log(err)
                snackbarActivate()
            }
        }
        snackbarActivate()
        return false
    }

    toAPI_put(sms_id){
        this.sendStatus = this.checkRequiredIsNotEmpty()
        console.log(this.sendStatus)
        if(this.sendStatus){
            try {
                let data ={
                    id: this.service.id,
                    numlist: Number(this.single.numlist.value),
                    namelist: this.single.namelist.value,
                    id_configuration: this.single.id_configuration.object.id,
                    
                    status:   false, //not using in back but it's required
                    id_message_text: this.single.id_message_text.id
                }

                // if(this.single.id_configuration.object.voice){
                //     data['id_audio']= this.single.id_audio.object.id
                // }

                let config = this.single.id_configuration.object
                // voice
                data['id_audio'] = config.voice ? this.single.id_audio.object.id : null
                // sms
                // if(config.sms){
                //     console.log('config.sms', sms_id)
                //     if(sms_id==null){
                //         data=false
                //     }
                //     else{
                //         data['id_message_text'] = sms_id
                //     }
                // }
                // else{
                //     data['id_message_text'] = null
                // }

                this.sendStatus=false // to default
                return data

            } 
            catch (err) {
                console.log(err)
                snackbarActivate()
                // console.log(err)        
            }
            
        }
        snackbarActivate()
        return false
    }

    fromAPI(response){
        this.service.id = response.id
        this.single.numlist.value              =  String(response.numlist)  //in base number
        this.single.namelist.value              = response.namelist       
        this.single.status.value                = this.mapStatus[response.status]
        // this.single.status.value                = Boolean(response.status)
        this.single.id_message_text.id       = response.id_message_text               

        // select audio from all audios        
        if (response.id_audio!=null){
            this.single.id_audio.object = _.filter(this.single.id_audio.data, (audio) => {
                return audio.id == response.id_audio
            })[0]
            // console.log(this.single.id_audio.object)
            this.single.id_audio.value = this.single.id_audio.object.filename
        }

        // select config from all configs        
        if (response.id_configuration!=null){
            this.single.id_configuration.object = _.filter(this.single.id_configuration.data, (config) => {
                return config.id == response.id_configuration
            })[0]
            this.single.id_configuration.value = this.single.id_configuration.object.name
        }

        this.sortAudioById()

     }

    sortAudioById(){
        this.single.id_audio.data = _.orderBy(this.single.id_audio.data, 'id', 'desc')
        // console.log(t)
    }

}



export class ListReportForm {
    constructor() {
        this.head = { text: 'Информация о списке' };
        this.single = {
            numlist:           { id: '', type: 'text', name: 'Номер списка',       value: '', }, 
            namelist:          { id: '', type: 'text', name: 'Название',       value: '', }, 
            audio:             { id: null, type: 'text', name: 'Аудио', value: null, },
            notified:          { id: '', type: 'text', value: null, },
            id_message_text:   {value: null, id:null,  text: '' },
            config:            { id: '', type: 'text', name: 'Конфигурация', value: null, object: null, },
            run_by:            { id: '', type: 'text', name: 'Кем запущен', value: null, },
            stop_by:           { id: '', type: 'text', name: 'Кем остановлен', value: null, },
            start_time:        { id: '', type: 'text', name: 'Время начала', value: null, },
            end_time:          { id: '', type: 'text', name: 'Время окончания', value: null, },
        };
        // this.service = {
        //     id: null,
        // }
    }
    setConfig(config){

        this.single.config.object = config
        this.single.config.value = config.name
    }

    setAudio(audio){
        this.single.audio.id                 = audio.id    
        this.single.audio.value                 = audio.filename
    }

    timefunction(val){
        let time = null ? null : (new Date(val)).toLocaleString('ru-RU', { hour12: false, })
        return time
    }

    fromAPI(response){
        
        console.log(response)
        
        
        this.single.notified.value = `${response.notifyed_emp} из ${response.total_emp}`
        this.single.numlist.value              =  String(response.numlist)  //in base number
        this.single.namelist.value              = response.namelist       
        this.single.id_message_text.value       = response.message_text

        this.single.run_by.value       = response.run_by
        this.single.stop_by.value       = response.stop_by

        this.single.start_time.value       = this.timefunction(response.start_time + 'Z') 
        this.single.end_time.value       = this.timefunction(response.end_time + 'Z')  

        
        
        
    
    }

}

export class LastReportForm{
    constructor() {
        this.head = { text: 'Последний отчет списка' };
        this.single = {
            notified:          { id: '', type: 'text', value: null, },
            run_by:            { id: '', type: 'text', name: 'Кем запущен', value: null, },
            stop_by:           { id: '', type: 'text', name: 'Кем остановлен', value: null, },
            start_time:        { id: '', type: 'text', name: 'Время начала', value: null, },
            end_time:          { id: '', type: 'text', name: 'Время окончания', value: null, },
        };
        
        this.service = {
            id: null,
        }
        this.clickFunction = null
    }

    

    timefunction(val){
        let time = null ? null : (new Date(val)).toLocaleString('ru-RU', { hour12: false, })
        return time
    }

    fromAPI(response){
        // console.log(response)
        this.service.id = response.id
    
        this.single.notified.value = `${response.notifyed_emp} из ${response.total_emp}`
        

        this.single.run_by.value       = response.run_by
        this.single.stop_by.value       = response.stop_by

        this.single.start_time.value       = this.timefunction(response.start_time + 'Z') 
        this.single.end_time.value       = this.timefunction(response.end_time + 'Z')  

        
        
        
    
    }

}