import { Rpc } from '../index'

process.on('uncaughtException', (err) => {
    // tslint:disable-next-line:no-console
    console.error(err)
})

class Sandbox {
    private env = null
    constructor (env, ws) {
        this.env = env
    }

    async foo (value) {
        const res = await new Promise((resolve) => {
            setTimeout(function () {
                resolve('hello' + value)
            }, 1000)
        })
        return res
    }
}

const sb = Rpc(3189, Sandbox)
