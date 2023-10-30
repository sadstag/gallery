import { build } from 'vite'
;(async () => {
    await build({
        root: '.',
        base: '/',
        assetsInclude: ['./assets/*.txt'],
        build: {
            rollupOptions: {
                // ...
            }
        }
    })
})()
