import * as uuid from 'uuid'
import * as WS from 'ws'
import { port } from '../config'
import SandBox from './sandbox'

interface Req {
    type: 'request'
    id: string
    zara: string[]
}

const zaraError = (ws, err) => {
    ws.send(JSON.stringify({
        type: 'error',
        msg: err
    }))
}

class Rpc extends SandBox {
    static instance = null
    private wss: WS.Server
    private ENV: any
    private interval: any

    constructor () {
        super ()
        if (Rpc.instance) {
            return Rpc.instance
        }
        this.wss = new WS.Server({ port })
        this.wss.on('connection', (ws) => {
            const env: any = {}
            const uid = uuid.v1()
            env.userId = uid
            ws.userId = uid
            ws.isAlive = true

            ws.on('message', async (opt: string) => {
                const req: Req = JSON.parse(opt)
                const {type, id, zara} = req
                if (!id) {
                    return zaraError(ws, 'Request must contain id')
                }
                if (!zara) {
                    return zaraError(ws, 'Request must contain zara')
                }
                if (type !== 'request') {
                    return zaraError(ws, 'Request type must corrent')
                }
                const funcName = zara.shift()
                const params = zara
                try {
                    const ret = await super[funcName](...params)
                    ws.send(JSON.stringify({
                        type: 'response',
                        id,
                        zara: ret
                    }))
                } catch (error) {
                    return zaraError(ws, 'sandbox has not define this function')
                }
            })
            ws.on('pong', () => {
                ws.isAlive = true
            })
            ws.on('error', (err) => {
                throw err
            })
            ws.send(uid)
        })
        this.interval = setInterval(() => {
            const clients = this.wss.clients
            clients.forEach((ws) => {
                const {isAlive, userId} = ws
                if (isAlive === false) {
                    return ws.terminate()
                }
                ws.ping('', false, true)
                ws.isAlive = false
            })
        }, 5000)
        Rpc.instance = this
    }
}

export default Rpc
