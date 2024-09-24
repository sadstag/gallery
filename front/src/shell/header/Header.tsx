import { useContent } from '@context/ContentProvider'
import { A } from '@solidjs/router'
import styles from './Header.module.css'
import { Menu } from './Menu'

export function Header() {
	const content = useContent()

	return (
		<div class={styles.header}>
			<div class={styles.title}>
				<A href="/">{content?.()?.title || '???'}</A>
				<span class={styles.subtitle}>{content?.()?.subtitle || ''}</span>
			</div>
			<Menu />
		</div>
	)
}
