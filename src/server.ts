import * as uuid from 'uuid'
import * as WS from 'ws'

interface Req {
    type: string
    id: string
    zara: string[]
}

const zaraError = (ws, err) => {
    ws.send(JSON.stringify({
        type: 'error',
        msg: err
    }))
}

class RpcSocket extends WS {
    userId: string
    isAlive: boolean
    sandbox: any
}

class Server {
    static instance = null
    private wss: WS.Server<typeof RpcSocket>
    private ENV: any
    private interval: any

    constructor (port, Sandbox) {
        if (Server.instance) {
            return Server.instance
        }
        this.wss = new WS.Server({ port, WebSocket: RpcSocket })
        this.wss.on('connection', (ws) => {
            const env: any = {}
            const uid = uuid.v1()
            env.userId = uid
            ws.userId = uid
            ws.isAlive = true
            ws.sandbox = new Sandbox(env, ws)

            ws.on('message', async (opt) => {
                let req: Req
                try {
                    const message = Array.isArray(opt) ? Buffer.concat(opt) : Buffer.from(opt as ArrayBuffer)
                    req = JSON.parse(message.toString())
                }catch (err) {
                    return zaraError(ws, 'Request is not legal json')
                }
                const {type, id, zara} = req
                switch (type) {
                    case 'request':
                        if (!id) {
                            return zaraError(ws, 'Request must contain id.')
                        }
                        if (!zara) {
                            return zaraError(ws, 'Request must contain zara.')
                        }
                        if (type !== 'request') {
                            return zaraError(ws, 'Request type must corrent.')
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
                        break
                    case 'pong':
                        ws.isAlive = true
                        break
                    default:
                        return zaraError(ws, 'Unknow type.')
                }
            })
            ws.on('error', (err) => {
                zaraError(ws, err)
            })
            ws.send(JSON.stringify({
                type: 'connection',
                userId: uid
            }))
        })
        this.interval = setInterval(() => {
            const clients = this.wss.clients
            clients.forEach((ws) => {
                if (!ws.isAlive) {
                    ws.sandbox = null
                    return ws.terminate()
                }
                ws.send(JSON.stringify({
                    type: 'ping'
                }))
                ws.isAlive = false
            })
        }, 5000)
        Server.instance = this
    }
}


export default (port = 3189, Sandbox) => {
    return new Server(port, Sandbox)
}
