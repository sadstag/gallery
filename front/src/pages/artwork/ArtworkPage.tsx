import { useArtworkImagesDBResource } from '@context/ArtworkImagesDBProvider'
import { useWallModel } from '@context/wall/WallModelProvider'
import { Link } from '@ds/Link/Link'
import type { ArtworkImageSize } from '@model/ArtworkImageSize'
import type { ArtworkId } from '@model/base'
import { useNavigate, useParams } from '@solidjs/router'
import { Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { SolidMarkdown } from 'solid-markdown'
import { useArtwork } from '../../context/ArtworksDBProvider'
import { ArtworkInfo } from './ArtworkInfo'
import styles from './ArtworkPage.module.css'

const ANGLE_TOP = -90
const ANGLE_RIGHT = 0
const ANGLE_LEFT = 180

type Direction = 'top' | 'left' | 'right' | 'none'

function getSwipeDirection(deltaX: number, deltaY: number, toleranceAngle = 30): Direction {
	const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI // between -180 and 180
	if (Math.abs(angle - ANGLE_TOP) <= toleranceAngle) {
		return 'top'
	}
	if (Math.abs(angle - ANGLE_RIGHT) <= toleranceAngle) {
		return 'right'
	}
	if (Math.abs(angle - ANGLE_LEFT) <= toleranceAngle || Math.abs(360 + angle - ANGLE_LEFT) <= toleranceAngle) {
		return 'left'
	}
	return 'none'
}

export const ArtworkPage = () => {
	const params = useParams()

	const artworkImagesDB = useArtworkImagesDBResource()

	// biome-ignore lint/style/useConst: typescript not able to see that there is a proxy under
	let imgRef: HTMLImageElement | undefined = undefined

	const [imgURL, setImgURL] = createSignal<string | undefined>(artworkImagesDB?.()?.getImageURL(params.id, 'small'))

	const artwork = createMemo(() => useArtwork(params.id))

	createEffect(() => {
		let size: ArtworkImageSize = 'small'
		if (imgRef) {
			// @ts-ignore
			size = imgRef.width > 800 || imgRef.width >= 800 ? 'large' : 'medium'
		}
		setImgURL(artworkImagesDB?.()?.getImageURL(params.id, size))
	})

	// Naivgation through artworks using wall model
	const { wallModel } = useWallModel()

	const navigate = useNavigate()

	const visitArtwork = (destId: ArtworkId) => {
		navigate(`/artwork/${destId}`, { replace: true })
	}

	const visitPreviousArtwork = () => visitArtwork(getArtworkId(-1))

	const visitNextArtwork = () => visitArtwork(getArtworkId(1))

	const backToWall = () => navigate('/', { replace: true })

	const getArtworkId = (delta: -1 | 1) => {
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
	const handleKeyDown = (e: KeyboardEvent) => {
		// keydown allow event repetition fired at high rate, so that we can rapidly browse the collection
		switch (e.key) {
			case 'ArrowLeft':
				visitPreviousArtwork()
				break
			case 'ArrowRight':
				visitNextArtwork()
				break
			case 'Escape': // no break
			case 'ArrowUp': // no break
			case 'ArrowDown':
				backToWall()
				break
		}
	}

	let touchStartX: number
	let touchStartY: number

	const handleTouchStart = ({ touches: [{ clientX, clientY }] }: TouchEvent) => {
		touchStartX = clientX
		touchStartY = clientY
	}

	const handleTouchEnd = (e: TouchEvent) => {
		const {
			changedTouches: [{ clientX, clientY }],
		} = e
		const deltaX = clientX - touchStartX
		const deltaY = clientY - touchStartY
		switch (getSwipeDirection(deltaX, deltaY)) {
			case 'top': {
				backToWall()
				return
			}
			case 'left': {
				visitPreviousArtwork()
				return
			}
			case 'right': {
				visitNextArtwork()
				return
			}
		}
	}

	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('touchstart', handleTouchStart)
	window.addEventListener('touchend', handleTouchEnd)

	onCleanup(() => {
		window.removeEventListener('keydown', handleKeyDown)
		window.removeEventListener('touchstart', handleTouchStart)
		window.removeEventListener('touchend', handleTouchEnd)
	})

	const title = () => artwork()?.title ?? 'untitled'
	const subtitle = () => artwork()?.subtitle
	const description = () => artwork()?.description ?? ''

	return (
		<article class={styles.page}>
			<div
				class={styles.image}
				ref={imgRef}
				style={{
					'background-image': `url(${imgURL() || 'TODO url ??'})`,
				}}
			/>
			<Show when={artwork()}>
				<div class={styles['info-panel']}>
					<h1>{title()}</h1>
					<Show when={subtitle()}>
						<h2>{subtitle()}</h2>
					</Show>
					<p>Reference: {artwork()?.id}</p>
					<Show when={description()}>
						<SolidMarkdown
							class={styles.presentation}
							components={{
								a: props => (
									<Link discrete={true} href={props.href}>
										{props.children}
									</Link>
								),
							}}
						>
							{description()}
						</SolidMarkdown>
					</Show>
					<ArtworkInfo artwork={artwork} />
				</div>
			</Show>
		</article>
	)
}
