import { For } from 'solid-js'

import styles from './Select.module.css'

export type Option = {
	value: string
	label: string
}

type Props = {
	value: string
	options: Option[]
	onChange: (value: string) => void
}

// continue on with https://moderncss.dev/custom-select-styles-with-pure-css/#multiple-select
// if multi selection is needed

export const Select = (props: Props) => {
	return (
		<div class={styles.select}>
			<select value={props.value} onChange={e => props.onChange(e.target.value)}>
				<For each={props.options}>{({ value, label }) => <option value={value}>{label}</option>}</For>
			</select>
		</div>
	)
}
