import { useArtworkImagesDBResource } from '@context/ArtworkImagesDBProvider'
import { useArtworksDBResource } from '@context/ArtworksDBProvider'
import { useContent } from '@context/ContentProvider'
import { WallModelProvider } from '@context/wall/WallModelProvider'
import { Match, Switch } from 'solid-js'
import { Wall } from './Wall'

const Loader = () => <div>Loading artworks ...</div>
const LoadingFailed = () => <div>Sorry, artworks loading failed :/ please try again later.</div>

export const MainPage = () => {
	const content = useContent()
	const artworksDB = useArtworksDBResource()
	const artworkImagesDB = useArtworkImagesDBResource()

	const dataIsLoading = () => content?.loading || artworksDB?.loading || artworkImagesDB?.loading
	const dataLoadingFailed = () => content?.error || artworksDB?.error || artworkImagesDB?.error

	return (
		<Switch
			fallback={
				<WallModelProvider>
					<Wall />
				</WallModelProvider>
			}
		>
			<Match when={dataIsLoading()}>
				<Loader />
			</Match>
			<Match when={dataLoadingFailed()}>
				<LoadingFailed />
			</Match>
		</Switch>
	)
}
