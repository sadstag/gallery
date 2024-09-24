import { Link } from '@ds/Link/Link'
import styles from './Footer.module.css'

export function Footer() {
	return (
		<div class={styles.footer}>
			<div>
				powered by{' '}
				<Link href="https://github.com/sadstag/gallery" discrete={true}>
					gallery
				</Link>
			</div>
		</div>
	)
}
