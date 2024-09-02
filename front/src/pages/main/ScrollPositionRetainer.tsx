import { } from '@solidjs/router';
import { type ParentProps, createEffect, onCleanup } from 'solid-js';
import { debounce } from '../../util/debounce';
import styles from './ScrollPositionRetainer.module.css'

window.history.scrollRestoration = "manual";

export const ScrollPositionRetainer = (props: ParentProps) => {
    let ref: HTMLDivElement;

    const storeWallScrollPosition = debounce(() => {
        window.localStorage.setItem('wallScrollPosition', ref.scrollTop.toString())
    })

    createEffect(() => {
        const scrollPosition = Number.parseInt(window.localStorage.getItem('wallScrollPosition') || "0", 10) || 0
        ref.scrollTo(0, scrollPosition)
        ref.addEventListener('scroll', storeWallScrollPosition)
    })

    onCleanup(() => {
        ref.removeEventListener('scroll', storeWallScrollPosition)
    })

    // @ts-ignore
    return <div ref={ref} class={styles.scrollPositionRetainer}>{props.children}</div>

}