import type { JSX } from 'solid-js'
import styles from './ArtworkPage.module.css'

type Props = {
	label: string
	value: JSX.Element
}

export function InfoBloc({ label, value }: Props) {
	return (
		<div class={styles['info-bloc']}>
			<div class={styles.label}>{label}</div>
			<div class={styles.value}>{value}</div>
		</div>
	)
}
