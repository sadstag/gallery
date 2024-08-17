import type { ParentProps } from "solid-js"
import styles from './Button.module.css'

type Props = ParentProps<{ className?: string; onClick: () => void }>

export const Button = ({ children, className = '', onClick }: Props) => {
    const realClassName = [className, styles.button].join(' ')
    return <button class={realClassName} type="button" onClick={onClick}>{children}</button>
}