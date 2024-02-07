import _ from 'lodash';


export class EmployeeTable {
    constructor(body) {
        this.thead = { 
            surname:  {value:   'Фамилия'      , sort: null        }               ,          
            name:     {value:   'Имя'          , sort: null        }               ,      
            second_name: {value:   'Отчество'     , sort: null        }              ,          
            division: {value:   'Подразделение', sort: null        }             ,          
            position: {value:   'Должность'    , sort: null        }             ,          
            phones:    {value:   'Телефон'      , sort: null,        }               ,      
        }
        this.tbodyConst = []    //для постоянной
        this.tbody = []         // результат в отображении, к нему применяется фильтрация
        this.service = {
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
        this.orderById()
    }
    serialize(data){
        for (let item in data){
            let entry = {common: {}, service: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id

            // checkboxes       Надо ли??
            entry.service.checked = false
            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }
    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class PositionTable {
    constructor(body) {
        this.thead = { 
            position_name:  {value:   'Название должности'      , sort: null        }               ,          
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
    }
    serialize(data){ 
        for (let item in data){
            let entry = {common: {}, service: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id
            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }
    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class AudioTable {
    constructor(body) {
        this.thead = { 
            filename:  {value:   'Название аудио'      , sort: null        }               ,          
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
    }
    serialize(data){ 
        for (let item in data){
            let entry = {common: {}, service: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id
            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }
    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class ListTable {
    constructor(body) {
        this.thead = { 
            namelist:  {value:   'Название'      , sort: null        }               ,          
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
    }
    serialize(data){ 
        for (let item in data){
            let entry = {common: {}, service: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id
            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }
    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class ReportsTable {
    constructor(body) {
        this.thead = { 
            namelist:  {value:   'Номер: Название списка'      , sort: null        }               ,       
            status:  {value:   'Статус'      , sort: null        }               ,       
            run_by:  {value:   'Кем запущен'      , sort: null        }               ,       
            // stop_by:  {value:   'Кем остановлен'      , sort: null        }               ,       
            // start_time:  {value:   'Время начала'      , sort: null, serializeFunction: (value)=> this.timefunction(value)        }               ,       
            start_time:  {value:   'Время начала'      , sort: null, viewFunction: (value)=> this.splitfunction(value)}               ,       
            end_time:  {value:   'Время окончания'      , sort: null,  viewFunction: (value)=> this.splitfunction(value)}               ,       
            // audio_id:  {value:   'audio_id'      , sort: null        }               ,       
            // message_text:  {value:   'message_text'      , sort: null        }               ,            
            run_list_type:  {value:   'Тип оповещения'      , sort: null, type: 'icon'        }               ,         
            notified:  {value:   'Уведомлено/Всего'      , sort: null,         }               ,            
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.statusMap = {
            'running': 'Выполняется',
            'completed': 'Завершен',
            'canceled': 'Отменен'
        }

        this.run_list_typeMap = {
            0: null,
            1: 'phone-classic',
            2: 'email',
            3: 'phone-classic, email'
        }

        this.serialize(body)
    }
    serialize(data){ 
        for (let item in data){
            let entry = {common: {}, service: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id

            if(entry.common.status=='canceled'){
                entry.common.status = `${this.statusMap[entry.common.status]}: ${data[item].stop_by}`
            }
            else{
                entry.common.status = this.statusMap[entry.common.status]
            }
            
            entry.common.start_time = this.timefunction(entry.common.start_time + 'Z') 
            
            if(entry.common.end_time=='0001-01-01T00:00:00'){
                entry.common.end_time=null
            }
            else{
                entry.common.end_time = this.timefunction(entry.common.end_time + 'Z')
            }
            
            entry.common.run_list_type = this.run_list_typeMap[entry.common.run_list_type]
            
            entry.common.namelist = `${data[item]['numlist']}: ${entry.common.namelist}`

            entry.common.notified = `${data[item]['notifyed_emp']}/${data[item]['total_emp']}`
            
            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }


    timefunction(val){
        let time = null ? null : (new Date(val)).toLocaleString('ru-RU', { hour12: false, })
        return time
    }
    splitfunction(value){
        return value.split(',')
    }

    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class CallTable {
    constructor(body) {
        this.thead = { 
            // employees_id:  {value:   'employees_id'      , sort: null        }               ,       
            fio:  {value:   'ФИО'      , sort: null        }               ,       
            status:  {value:   'Статус оповещения'      , sort: null        }               ,       
            division:  {value:   'Подразделение'      , sort: null        }               ,       
            position:  {value:   'Должность'      , sort: null, }               ,       
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
    }
    serialize(data){ 
        // console.log('372',data)
        // this.tbody = []
        for (let item in data){
            
            let entry = {common: {}, service: {}, nesteds: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id

            // nesteds
            let nesteds = { calls: data[item].calls, 
                            sms: data[item].smsinfo}
            entry.nesteds = nesteds
            // entry.nesteds_visible = {calls: true, sms: true}
            entry.nesteds_visible = true

            entry.common.status = entry.common.status ? 'Да' : 'Нет'

            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }

    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class CallInfoTable {
    constructor(body) {
        this.thead = { 
            // channel:  {value:   'channel'      , sort: null        }               ,       
            dst_phone:  {value:   'Телефон'      , sort: null        }               ,       
            time_start:  {value:   'Время начала'      , sort: null, viewFunction: (value)=> this.splitfunction(value)        }               ,       //serializeFunction: (value)=> this.timefunction(value),
            time_end:  {value:   'Время окончания'      , sort: null,   serializeFunction: (value)=> this.timefunction(value)        }               ,   
            // time_connect:     {value:   'time_connect',     sort: null, serializeFunction: (value)=> this.timefunction(value)        }               ,   
            // runlist_id:       {value:   'runlist_id',       sort: null        }               ,   
            call_status:      {value:   'Статус звонка',      sort: null        }               ,   
            // cause:            {value:   'cause',            sort: null        }               ,   
            accounting:       {value:   'Авторизация',       sort: null        }               ,   
            confirmed:        {value:   'Подтверждение',        sort: null        }               ,   
            playback_status:  {value:   'Прослушано',  sort: null        }               ,   
            // dtmf:             {value:   'DTMF',             sort: null        }               ,   
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };
        
        this.call_statusMap = {
            'ANSWER': 'Принято',
            'BUSY': 'Занято',
            'NOANSWER': 'Нет ответа'

        }

        this.playback_statusMap = {
            'FAILED': 'Нет',
            'SUCCESS': 'Да',
            null: 'Нет',

        }

        this.serialize(body)
    }

    timefunction(val){
        let time = null ? null : (new Date(val)).toLocaleString('ru-RU', { hour12: false, })
        return time
    }
    splitfunction(value){
        return value.split(',')
    }
    

    serialize(data){ 
        for (let item in data){
            
            let entry = {common: {}, service: {}, nesteds: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id

            entry.common.accounting = (entry.common.accounting) ? 'Да' : 'Нет'
            entry.common.confirmed = (entry.common.confirmed) ? 'Да' : 'Нет'
            entry.common.playback_status = this.playback_statusMap[entry.common.playback_status]

            entry.common.call_status = this.call_statusMap[entry.common.call_status]

            
            // time_end
            entry.common.time_start = this.timefunction(entry.common.time_start + 'Z') 
            
            if(entry.common.time_end=='0001-01-01T00:00:00'){
                entry.common.time_end=null
            }
            else{
                entry.common.time_end = this.timefunction(entry.common.time_end + 'Z')
            }


            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }


    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}
export class SmsInfoTable {
    constructor(body) {
        this.thead = { 

            // employee_id:       {value:   'employee_id',        sort: null },                                                                     
            // runlist_id:        {value:   'runlist_id',         sort: null },                                                                     
            // message_id:        {value:   'message_id',         sort: null },                                                                     
            dst_phone:         {value:   'Телефон',          sort: null },                                                                          
            // state:             {value:   'state',              sort: null },                                                                     
            // creationDateUtc:   {value:   'Время создания',    sort: null, serializeFunction: (value)=> this.timefunction(value) },               
            submittedDateUtc:  {value:   'Время отправки',   sort: null, serializeFunction: (value)=> this.timefunction(value) },                   
            reportedDateUtc:   {value:   'Время доставки',    sort: null, serializeFunction: (value)=> this.timefunction(value) },                  
            // timeStampUtc:      {value:   'timeStampUtc',       sort: null, serializeFunction: (value)=> this.timefunction(value) },              
            stateDescription:  {value:   'Статус',   sort: null },                                                                                  
            // price:             {value:   'Стоимость',              sort: null },                                                                 
        }
        this.tbodyConst = []
        this.tbody = []
        this.service = {
            id: null,
            sort: {
                field: '', orderBy: 0
            } 
        }

        this.sortMap = {
            null: 'asc',
            asc: 'desc',
            desc: null,
          };

        this.serialize(body)
    }
    serialize(data){ 
        for (let item in data){
            
            let entry = {common: {}, service: {}, nesteds: {}}
            for (let field in this.thead){
                entry.common[field] = data[item][field]
            }
            entry.service.id = data[item].id

            this.tbody.push(entry)    
        }
        this.tbodyConst = this.tbody
    }

    timefunction(val){
        let time=null
        if(val!=null){
            time = null ? null : (new Date(val+'Z')).toLocaleString('ru-RU', { hour12: false })
        }
        
        return time
    }

    orderById(){
        this.tbody = _.orderBy(this.tbody, ['service.id'], ['asc'])
    }
    setSort(sortField){
        console.log(sortField)
        let tempSort = this.sortMap[this.thead[sortField].sort]
        for( let field in this.thead){
            this.thead[field].sort = null 
        }
        this.thead[sortField].sort = tempSort
        if (tempSort != null){
            this.tbody = _.orderBy(this.tbody, [`common.${sortField}`], [tempSort])
        }
        else{
            this.orderById()
        }
    }
    search(searchText){
        this.tbody = _.filter(this.tbodyConst, (user) => {
            return _.some(user.common, (value) => {
              return String(value).toLowerCase().includes(searchText.toLowerCase());
            });
          });
    }
}