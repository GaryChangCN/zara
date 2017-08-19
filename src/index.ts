import Rpc from './base/rpc'

process.on('uncaughtException', (err) => {
    // tslint:disable-next-line:no-console
    console.error(err)
})
const sb = new Rpc()
