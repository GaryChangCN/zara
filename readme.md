## zara

zara is an rpc lib

## Usage

> install

    ```bash
        npm install zara --save
        // ...or
        yarn add zara
    ```

> server 

In Sandbox class, it will save env object when a client connect, different connection with
different env. env will contain userId in default, which is connection id. when disconnect
sandbox will destory automatically.

Then you shou pass ws listen port and Sandbox to Server function to start rpc. default port
is 3189

    ```js
        import { Server } from 'zara'

        class Sandbox {
            private env = null
            constructor (env, ws) {
                this.env = env
            }

            async foo (p1, p2) {
                const res = await new Promise((resolve) => {
                    setTimeout(function () {
                        resolve(`${p1} ${p2}`)
                    }, 1000)
                })
                return res
            }
        }

        Server(3189, Sandbox)
    ```

> Client

You should pass url to Client function, default url is ws://localhost:3189.
you can invoke server function esaily though call function which is Client
class instance object. 

Attention: in call function you must use template string. and the only way
to pass params is use `${}`

    ```js
        call`(fun hello world)` // wrong
        call`(fun ${'hello'} ${'world'})` //correct
    ```

    ```js
        import {Client} from 'zara'

        const url = 'ws://localhost:3189'
        const { call } = Client(url)

        (async () => {
            const p1 = 'hello'
            const p2 = 'world'
            const res = await call`(foo
                ${p1} ${p2}
            )`
            console.log(res)  // hello world
        })()
    ```

> catch error

in order to catch error you can add the follow code in server and client

    ```js
        process.on('uncaughtException', (err) => {
            console.error(err)
        })
    ```

or just use `try...catch` statement

## develop

> dev

`git clone https://github.com/GaryChangCN/zara.git`
and `npm install` or `yarn install`
then `npm run dev` or `yarn run dev`

> build

`npm run build` or `yarn run build`

## LICENSE

[MIT](./LICENSE)