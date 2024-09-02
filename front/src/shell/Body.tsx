import { } from "@solidjs/router";
import type { ParentProps, } from "solid-js";
import styles from './Body.module.css'

export function Body(props: ParentProps) {
    return <div class={styles.body}>{props.children}</div>
}