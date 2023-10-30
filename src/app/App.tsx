import { useEffect, useState } from 'react'
import { Artwork } from '~common/Artwork'

export const App = () => {
    const [artworks, setArtworks] = useState<Artwork[] | 'loading' | 'error'>(
        'loading'
    )

    useEffect(() => {
        fetch('assets/artworks.json')
            .then((response) => {
                if (response.ok) {
                    return response
                        .json()
                        .then((payload) => setArtworks(payload))
                }
                setArtworks('error')
            })
            .catch((reason) => {
                setArtworks('error')
            })
    }, [])

    return (
        <div>
            Artworks :{' '}
            {typeof artworks === 'string' ? (
                artworks
            ) : (
                <pre>{JSON.stringify(artworks, null, '\t')}</pre>
            )}
        </div>
    )
}
