const kit = require('nokit')

module.exports = (task, option) => {
    option('-w, --watch', 'test------', 'world')

    task('default', ['typescript', 'file-change'], 'default task', (opts) => {
        kit.log('>>>>>> start >>>>>')
    })

    task('file-change', 'reload node file', () => {
        kit.spawn('noe', ['-w', 'src/**/*.js', 'src/index.js'], {
            prefix: 'NOE | :blue'
        })
    })

    task('typescript', ['tsw'])

    task('tsw', 'watch typescript', () => {
        kit.spawn('tsc', [
            '-w',
            './src/index.ts'
        ],{
            prefix: 'TSC | :green'
        })
    })
}
