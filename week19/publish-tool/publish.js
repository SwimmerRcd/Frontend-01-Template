const http = require('http')
const archiver = require('archiver')

const filename = 'dist'

const options = {
    host: 'localhost',
    port: 3001,
    path: `/?filename=${filename}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream'
    }
}

const req = http.request(options, res => {
    console.log(`status code: ${res.statusCode}`)
})
req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
})


const archive = archiver('zip', {
    zlib: { level: 9 }
})

archive.pipe(req)

archive.directory('./dist', false)

archive.finalize();