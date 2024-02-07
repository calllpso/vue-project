import { HubConnectionBuilder  } from '@microsoft/signalr';
import state from '@globals/state'
import auth from '../auth/authentification'


let socket = new HubConnectionBuilder()
.withUrl(state.socket_addr, {headers: {'Authorization': auth.token} })
.build()

async function start() {
    socket.headers = {'Authorization': auth.token}
    try {
        await socket.start();
        console.log("SignalR Connected.");
    } catch (err) {
        // auth.isAuthenticated = false            ///////////////
        auth.token = null 
    }
}
// start()


export default socket



