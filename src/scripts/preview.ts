import { preview } from 'vite'
;(async () => {
    const previewServer = await preview({
        preview: {
            port: 8080,
            open: true
        }
    })

    previewServer.printUrls()
})()
