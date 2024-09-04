import type { ParentProps } from "solid-js"
import styles from './Link.module.css'

type Props = ParentProps<{
    href: string
    discrete?: boolean
}>

export const Link = (props: Props) =>
    <a href={props.href} classList={{ [styles.link]: true, [styles.discrete]: props.discrete ?? false }}>
        {props.children}
    </a>