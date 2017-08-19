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

export default Sandbox
