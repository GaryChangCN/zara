import * as uuid from 'uuid'
import * as Websocket from 'ws'
import { port } from '../config'

const websocket = () => {
    const WServer = Websocket.Server
    const wss = new WServer({ port })
    wss.on('connection', (ws) => {
        ws.on('message', (msg) => {
            console.log(msg)
        })
        ws.on('error', (msg) => {
            console.log(msg)
        })
        ws.send('so')
    })
}

export default websocket
