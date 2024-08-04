import { Match, Switch } from 'solid-js'
import { useArtworkImagesDBResource } from '../../context/ArtworkImagesDBProvider'
import { useArtworksDBResource } from '../../context/ArtworksDBProvider'
import { useContent } from '../../context/ContentProvider'
import { Wall } from './Wall'

const Loader = () => <div>LOADER</div>
const LoadingFailed = () => <div>FAILED :/</div>

export const MainPage = () => {
    const content = useContent()
    const artworksDB = useArtworksDBResource()
    const artworkImagesDB = useArtworkImagesDBResource()

    const dataIsLoading = () => content?.loading || artworksDB?.loading || artworkImagesDB?.loading
    const dataLoadingFailed = () => content?.error || artworksDB?.error || artworkImagesDB?.error

    return (
        <Switch fallback={<Wall />}>
            <Match when={dataIsLoading()}>
                <Loader />
            </Match>
            <Match when={dataLoadingFailed()}>
                <LoadingFailed />
            </Match>
        </Switch>
    )
}

