import { Artwork } from '../../model/Artwork'
import styles from './Wall.module.css'

type Props = {
    artwork: Artwork
}
export function ArtworkBloc(props: Props) {

    const { artwork: { id, title } } = props

    const style = {
        'background-image': `url(artworks/images/small/${id}.webp)`,
    }

    return (
        <div
            class={styles.artworkBloc}
            style={style}>
            <div class={styles.title}>
                {title}
            </div>
        </div >
    )
}