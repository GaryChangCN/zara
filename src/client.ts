import * as uuid from 'uuid'

class Client {
    static instance = null
    ws: any
    userId: string
    private cb: any = {}
    constructor (url = 'ws://localhost:3189') {
        if (Client.instance) {
            return Client.instance
        }
        this.ws = new Websocket(url)
        this.ws.on('message', (data) => {
            let res
            try {
                res = JSON.parse(data)
            } catch (err) {
                throw new Error('Response is not legal json')
            }
            this.sloat(res)
        })
        Client.instance = this
    }
    call (litervals, ...params) {
        const funcName = litervals[0].replace(/^\(/, '').trim()
        const id = uuid.v1()
        this.ws.send(JSON.stringify({
            type: 'request',
            id,
            zara: [funcName, ...params]
        }))
        return new Promise((resolve) => {
            this.cb[id] = resolve
        })
    }
    private sloat (res) {
        if (!res.type) {
            throw new Error('Zara response must contain type')
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
            default:
                throw new Error('Unknow zara type')
        }
    }
}

export default (port) => {
    return new Client(port)
}
