import { useArtworkImagesDBResource } from '@context/ArtworkImagesDBProvider'
import { useArtwork } from '@context/ArtworksDBProvider'
import { Link } from '@ds/Link/Link'
import type { ArtworkImageSize } from '@model/ArtworkImageSize'
import { Show, createEffect, createMemo, createSignal } from 'solid-js'
import { SolidMarkdown } from 'solid-markdown'
import { ArtworkInfo } from './ArtworkInfo'
import styles from './ArtworkPage.module.css'

type Props = {
	id: string
}

export const ArtworkPresentation = (props: Props) => {
	const artworkImagesDB = useArtworkImagesDBResource()

	// biome-ignore lint/style/useConst: typescript not able to see that there is a proxy under
	let imgRef: HTMLImageElement | undefined = undefined

	const [imgURL, setImgURL] = createSignal<string | undefined>(artworkImagesDB?.()?.getImageURL(props.id, 'small'))

	const artwork = createMemo(() => useArtwork(props.id))

	createEffect(() => {
		let size: ArtworkImageSize = 'small'
		if (imgRef) {
			// @ts-ignore
			size = imgRef.width > 800 || imgRef.width >= 800 ? 'large' : 'medium'
		}
		setImgURL(artworkImagesDB?.()?.getImageURL(props.id, size))
	})

	const title = () => artwork()?.title ?? 'untitled'
	const subtitle = () => artwork()?.subtitle
	const description = () => artwork()?.description ?? ''

	return (
		<>
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
		</>
	)
}
