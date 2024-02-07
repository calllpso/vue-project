import { defineStore } from 'pinia'
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'

import { HubConnectionBuilder, HttpTransportType, LogLevel  } from '@microsoft/signalr';




export const useSocketStore = defineStore('socket', () => {
    const authStore = useAuthStore()
    const addressStore = useAddressStore()

    const socket = new HubConnectionBuilder()
    .withUrl(addressStore.socket_addr, 
    {  transport: HttpTransportType.LongPolling,
        headers: {
        'Charset': 'utf-8',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authStore.token,
        }}
        )
    // .configureLogging(LogLevel.Information)
    .build()

    async function start() {
        // console.log(authStore.token)
        socket.headers = {'Authorization': authStore.token}
        try {
            await socket.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.log('_______ошибка',err)
            // auth.token = null 
            // setTimeout(start, 3000);
        }
    }
    
    return { socket, start }
  })





// let socket = new HubConnectionBuilder()
// .withUrl(state.addressStore.socket_addr, {headers: {'Authorization': auth.token} })
// .build()

// async function start() {
//     socket.headers = {'Authorization': auth.token}
//     try {
//         await socket.start();
//         console.log("SignalR Connected.");
//     } catch (err) {
//         console.log(err)
//         // auth.isAuthenticated = false            ///////////////
//         // auth.token = null 
//         setTimeout(start, 3000);
//     }
// }
// start()


// socket.onclose(async () => {
//     await start();
// });


// export default socket
