import { WallModelProvider } from '@context/wall/WallModelProvider'
import { Triptych } from './Triptych'

export const ArtworkPage = () => {
	return (
		<WallModelProvider>
			<Triptych />
		</WallModelProvider>
	)
}
