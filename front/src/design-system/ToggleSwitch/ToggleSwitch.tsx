import styles from './ToggleSwitch.module.css'

type Props = {
    value: boolean
    onChange: (value: boolean) => void
}

export const ToggleSwitch = (props: Props) => {
    return <input type="checkbox" class={`${styles.toggle} ${styles.small}`} checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />
}