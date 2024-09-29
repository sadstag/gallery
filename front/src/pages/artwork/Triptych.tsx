import { useWallModel } from '@context/wall/WallModelProvider'
import type { ArtworkId } from '@model/base'
import { useNavigate, useParams } from '@solidjs/router'
import { createSignal } from 'solid-js'
import styles from './ArtworkPage.module.css'
import { ArtworkPresentation } from './ArtworkPresentation'
import { useNavigationWithKeyboard } from './navigation/keyboard'
import { useNavigationWithTouch } from './navigation/touch'

export const Triptych = () => {
	const params = useParams<{ id: string }>()

	const { wallModel } = useWallModel()
	const navigate = useNavigate()

	const visitArtwork = (destId: ArtworkId) => navigate(`/artwork/${destId}`, { replace: true })

	const getArtworkId = (delta: -1 | 1) => {
		// Navigation through artworks using wall model

		// find previous artwork
		const index = wallModel.filteredArtworks.findIndex(({ id: _id }) => _id === params.id)
		if (index === -1) {
			// not supposed to happen, but not a reason to crash
			return wallModel.filteredArtworks[0].id
		}
		return wallModel.filteredArtworks[
			// adding wallModel.filteredArtworks.length to avoid adressing index -1
			(index + delta + wallModel.filteredArtworks.length) % wallModel.filteredArtworks.length
		].id
	}

	const visitPreviousArtwork = () => visitArtwork(getArtworkId(-1))

	const visitNextArtwork = () => visitArtwork(getArtworkId(1))

	const backToWall = () => navigate('/', { replace: true })

	// abiome-ignore lint/style/useConst: typescript not able to see that there is a proxy under
	const [articleRef, setArticleRef] = createSignal<HTMLElement | undefined>()

	// TODO ne pas faire si pas de touch evnt sue le device
	useNavigationWithTouch(
		{
			top: backToWall,
			left: visitNextArtwork, // inversed with keyboard (natural direction for swipe)
			right: visitPreviousArtwork,
		},
		articleRef,
	)

	useNavigationWithKeyboard(
		{
			top: backToWall,
			left: visitPreviousArtwork,
			right: visitNextArtwork,
		},
		articleRef,
	)

	return (
		<>
			<div class={styles.triptych} ref={setArticleRef}>
				<aside class={[styles.artworkPresentation, styles.previous].join(' ')}>
					<ArtworkPresentation id={getArtworkId(-1)} />
				</aside>
				<article class={styles.artworkPresentation}>
					<ArtworkPresentation id={params.id} />
				</article>
				<aside class={[styles.artworkPresentation, styles.next].join(' ')}>
					<ArtworkPresentation id={getArtworkId(1)} />
				</aside>
			</div>
		</>
	)
}
