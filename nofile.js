const kit = require('nokit')

module.exports = (task, option) => {
    option('-w, --watch', 'test------', 'world')

    task('default', ['check-dev', 'typescript', 'file-change'], 'default task', (opts) => {
        kit.log('>>>>>> start >>>>>')
    })

    task('file-change', 'reload node file', () => {
        kit.spawn('noe', ['-w', 'src/**/*.js', 'src/index.js'], {
            prefix: 'NOE | :blue'
        })
    })

    task('check-dev', 'check git branch is dev',kit.async(function *() {
        const ret = yield kit.exec('echo $(git symbolic-ref --short HEAD)')
        const branch = ret.stdout.replace(/\s/g, '')
        if (branch !== 'dev') {
            throw new Error('you should run in dev branch!')
        }
    }))

    task('typescript', ['tsw'])

    task('tsw', 'watch typescript', () => {
        kit.spawn('node_modules/typescript/bin/tsc', [
            '-w',
            './src/index.ts'
        ],{
            prefix: 'TSC | :green'
        })
    })
}
