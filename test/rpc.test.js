const assert = require('node:assert/strict')
const { once } = require('node:events')
const test = require('node:test')
const { Server } = require('..')
const Client = require('../dist/client').default

test('public server and client round-trip a sandbox call', { timeout: 5000 }, async (t) => {
    class Sandbox {
        constructor(env) { this.env = env }
        greet(name) { return { name, userId: this.env.userId } }
    }
    const server = Server(0, Sandbox)
    t.after(() => {
        clearInterval(server.interval)
        for (const socket of server.wss.clients) socket.terminate()
        return new Promise(resolve => server.wss.close(resolve))
    })
    await once(server.wss, 'listening')
    const client = Client('ws://127.0.0.1:' + server.wss.address().port)
    client.ws.onclose = null
    await once(client.ws, 'open')
    const result = await client.call`(greet ${'世界'})`
    assert.deepEqual(result, { name: '世界', userId: client.userId })
    assert.match(result.userId, /^[0-9a-f-]{36}$/)
    const closed = once(client.ws, 'close')
    client.ws.close()
    await closed
})
