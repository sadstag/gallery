import { type ParentProps, createMemo } from "solid-js"
import styles from './Button.module.css'

type Props = ParentProps<{
    className?: string;
    highlighted?: boolean;
    onClick: () => void
}>

export const Button = (props: Props) => {
    const classes = createMemo(() => {
        const cl = [props.className, styles.button]
        if (props.highlighted) {
            cl.push(styles.highlighted)
        }
        return cl.join(' ')
    })
    return <button class={classes()} type="button" onClick={props.onClick}>{props.children}</button>
}