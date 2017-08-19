class Sandbox {
    static instance = null
    constructor () {
        if (Sandbox.instance) {
            return Sandbox.instance
        }
        Sandbox.instance = this
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

export default Sandbox
