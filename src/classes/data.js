
export class StatusData {
    constructor(data) {
        
        this.status= true,
        this.message= 'OK'
        
        
        this.serialize(data)
    }
    serialize(data){
        data.forEach(item => {
            if(item.state == false){
                this.status = item.state
                this.message = item.exMessage
                return this.data
            } 
        });
        return this.data
    }
}


export class AuthData {
    constructor(data) {        
        
        this.token
        this.role
        
        this.serialize(data)
    }
    serialize(data){
        this.token = data.data.token
        this.role = data.data.role
        /*  fields
            date 
            password
            role
            token
            useremail
            username
        */
    }
}

