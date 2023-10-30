import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
    const server = await createServer({
        // any valid user config options, plus `mode` and `configFile`
        configFile: false,
        root: '.', //__dirname,
        mode: 'development',
        server: {
            port: 3000,
            open: true
        }
    })
    await server.listen()

    server.printUrls()
})()
