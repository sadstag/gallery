import { Match, Switch } from 'solid-js'
import { useContent } from '../../context/ContentProvider'
import { useArtworksDBResource } from '../../context/ArtworksDBProvider'
import { Wall } from './Wall'

const Loader = () => <div>LOADER</div>
const LoadingFailed = () => <div>FAILED :/</div>

const MainPage = () => {
    const content = useContent()
    const artworksDB = useArtworksDBResource()

    const dataIsLoading = () => content?.loading || artworksDB?.loading
    const dataLoadingFailed = () => content?.error || artworksDB?.error

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

export default MainPage
