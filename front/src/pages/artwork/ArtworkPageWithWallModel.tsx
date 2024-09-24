import { WallModelProvider } from '@context/wall/WallModelProvider'
import { ArtworkPage } from './ArtworkPage'

export const ArtworkPageWithWallModel = () => {
	return (
		<WallModelProvider>
			<ArtworkPage />
		</WallModelProvider>
	)
}
