import Rpc from './base/rpc'
import SandBox from './base/sandbox'

process.on('uncaughtException', (err) => {
    // tslint:disable-next-line:no-console
    console.error(err)
})
const sb = Rpc(3189, SandBox)
