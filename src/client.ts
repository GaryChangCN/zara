import * as uuid from 'uuid'

class Client {
    static instance = null
    ws: any
    userId: string
    private cb: any = {}
    private interval: any
    constructor (url = 'ws://localhost:3189') {
        if (Client.instance) {
            return Client.instance
        }
        this.ws = new WebSocket(url)
        this.ws.onmessage = (ret) => {
            let res
            try {
                res = JSON.parse(ret.data)
            } catch (err) {
                throw new Error('Response is not legal json.')
            }
            this.sloat(res)
        }
        this.ws.onerror = (err) => {
            throw new Error(err)
        }
        this.ws.onclose = () => {
            throw new Error('socket is disconnected please refresh browser.')
        }
        Client.instance = this
    }
    call () {
        const litervals = Array.from(arguments)
        const funcName = litervals[0][0].replace(/^\(/, '').trim()
        litervals[0] = funcName
        const id = uuid.v1()
        this.ws.send(JSON.stringify({
            type: 'request',
            id,
            zara: litervals
        }))
        return new Promise((resolve) => {
            this.cb[id] = resolve
        })
    }
    private sloat (res) {
        if (!res.type) {
            throw new Error('Zara response must contain type.')
        }
        switch (res.type) {
            case 'error':
                throw new Error(res.msg)
            case 'response':
                const {id, zara} = res
                this.cb[id](zara)
                delete this.cb[id]
                break
            case 'connection':
                this.userId = res.userId
                break
            case 'ping':
                this.ws.send(JSON.stringify({
                    type: 'pong'
                }))
                break
            default:
                throw new Error('Unknow zara type.')
        }
    }
}

export default (port) => {
    return new Client(port)
}
