import { useBeforeLeave, useLocation } from "@solidjs/router";
import { type ParentProps, createEffect } from "solid-js";
import styles from './Body.module.css'

export function Body(props: ParentProps) {
    let ref: HTMLDivElement;

    const location = useLocation<{ scrollPosition: number }>()

    createEffect(() => {
        ref.scrollTo(0, location.state?.scrollPosition ?? 0)
    })

    useBeforeLeave(() => {
        window.history.replaceState({ scrollPosition: ref.scrollTop }, "")
    })

    // @ts-ignore
    return <div ref={ref} class={styles.body}>{props.children}</div>
}