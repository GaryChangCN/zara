const kit = require('nokit')

module.exports = (task, option) => {
    option('-w, --watch', 'test------', 'world')

    task('default', ['dev'], 'default task')

    task('dev', ['typescript', 'file-change'], 'default task', (opts) => {
        kit.log('>>>>>> start >>>>>')
    })

    task('build', 'build ts to js', () => {
        kit.spawn('node_modules/typescript/bin/tsc')
    })

    task('file-change', 'reload node file', () => {
        kit.spawn('noe', ['-w', 'src/**/*.js', 'src/example/server.js'], {
            prefix: 'NOE | :blue'
        })
    })

    task('typescript', ['tsw'])

    task('tsw', 'watch typescript', () => {
        kit.spawn('node_modules/typescript/bin/tsc', [
            '-w',
            './src/example/server.ts',
            '--lib',
            'es2015'
        ],{
            prefix: 'TSC | :green'
        })
    })

}
