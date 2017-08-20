import * as uuid from 'uuid'
import * as WS from 'ws'

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

class Server {
    static instance = null
    private wss: WS.Server
    private ENV: any
    private interval: any

    constructor (port, Sandbox) {
        if (Server.instance) {
            return Server.instance
        }
        this.wss = new WS.Server({ port })
        this.wss.on('connection', (ws) => {
            const env: any = {}
            const uid = uuid.v1()
            env.userId = uid
            ws.userId = uid
            ws.isAlive = true
            ws.sandbox = new Sandbox(env, ws)

            ws.on('message', async (opt: string) => {
                let req: Req
                try {
                    req = JSON.parse(opt)
                }catch (err) {
                    return zaraError(ws, 'Request is not legal json')
                }
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
                    const ret = await ws.sandbox[funcName](...params)
                    ws.send(JSON.stringify({
                        type: 'response',
                        id,
                        zara: ret
                    }))
                } catch (error) {
                    return zaraError(ws, error)
                }
            })
            ws.on('pong', () => {
                ws.isAlive = true
            })
            ws.on('error', (err) => {
                throw err
            })
            ws.send(JSON.stringify({
                type: 'connection',
                userId: uid
            }))
        })
        this.interval = setInterval(() => {
            const clients = this.wss.clients
            clients.forEach((ws) => {
                const {isAlive, userId} = ws
                if (isAlive === false) {
                    ws.sandbox = null
                    return ws.terminate()
                }
                ws.ping('', false, true)
                ws.isAlive = false
            })
        }, 5000)
        Server.instance = this
    }
}


export default (port = 3189, Sandbox) => {
    return new Server(port, Sandbox)
}
