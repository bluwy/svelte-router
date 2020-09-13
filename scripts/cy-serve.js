const http = require('http')
const path = require('path')
const sirv = require('sirv')

main()

async function main() {
  await serve()
}

async function serve() {
  const cwd = process.cwd()

  const servers = [
    { dir: 'public-hash', port: 10001, single: false },
    { dir: 'public-path', port: 10002, single: true },
    { dir: 'public-path-base', port: 10003, single: true }
  ]

  servers.forEach((server) => {
    http
      .createServer(
        sirv(path.resolve(cwd, `cypress/test-app/${server.dir}`), {
          dev: true,
          single: true
        })
      )
      .listen(server.port, () => {
        console.log(
          green(server.dir) + ' -> ' + green(`http://localhost:${server.port}`)
        )
      })
  })
}

function green(text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
