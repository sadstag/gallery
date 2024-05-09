import { useParams } from "@solidjs/router"

const ArtworkPage = () => {
    const { id } = useParams()
    return <>Artwork page, id = {id}</>
}

export default ArtworkPage