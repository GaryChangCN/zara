const kit = require('nokit')

module.exports = (task, option) => {
    option('-w, --watch', 'test------', 'world')

    task('default', ['dev'], 'default task')

    task('dev', ['typescript', 'noe'], 'default task', (opts) => {
        kit.log('>>>>>> start >>>>>')
    })

    task('build', 'build ts to js', () => {
        kit.spawn('node_modules/typescript/bin/tsc')
    })

    task('noe', 'reload node file', () => {
        kit.spawn('node_modules/nokit/bin/noe.js', ['-w', 'src/**/*.js', 'src/index.js'], {
            prefix: 'NOE | :blue'
        })
    })

    task('typescript', ['tsw'])

    task('tsw', 'watch typescript', () => {
        kit.spawn('node_modules/typescript/bin/tsc', [
            '-w',
            './src/index.ts',
            './src/client.ts',
            '--lib',
            'dom',
            '--lib',
            'es2015'
        ],{
            prefix: 'TSC | :green'
        })
    })

}
