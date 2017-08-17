const kit = require('nokit')

module.exports = (task, option) => {
    option('-w, --watch', 'test------', 'world')

    task('default', ['typescript', 'file-change'], 'default task', (opts) => {
        kit.log('>>>>>> start >>>>>')
    })

    task('file-change', 'reload node file', () => {
        kit.spawn('noe', ['src/index.js'], {
            prefix: 'NOE | :yellow'
        })
    })

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
