import { type ParentProps, createEffect, createMemo, onCleanup } from 'solid-js';
import { useSetting } from '../../context/SettingsProvider';
import { debounce } from '../../util/debounce';
import styles from './Wall.module.css'

window.history.scrollRestoration = "manual";

export const WallViewport = (props: ParentProps) => {
    let ref: HTMLDivElement;

    let timer: number | undefined

    const startIdleAnimationDelayStr = useSetting('startIdleAnimationDelay')
    const startIdleAnimationDelay = createMemo(() => Number.parseInt(startIdleAnimationDelayStr, 10))

    const setTimer = () => {
        timer = window.setTimeout(() => {
            timer = undefined
            window.dispatchEvent(new Event("user_felt_asleep"))
        }, startIdleAnimationDelay())
    }

    const userInteracted = () => {
        if (timer) {
            window.clearTimeout(timer)
        } else {
            window.dispatchEvent(new Event("user_awoke"))
        }
        setTimer()
    }

    const storeWallScrollPosition = debounce(() => {
        window.localStorage.setItem('wallScrollPosition', ref.scrollTop.toString())
    })

    const handleScroll = () => {
        userInteracted()
        storeWallScrollPosition()
    }

    createEffect(() => {
        const scrollPosition = Number.parseInt(window.localStorage.getItem('wallScrollPosition') || "0", 10) || 0
        ref.scrollTo(0, scrollPosition)
        ref.addEventListener('scroll', handleScroll)

        window.addEventListener('mousemove', userInteracted)
        window.addEventListener('touch', userInteracted)
    })

    onCleanup(() => {
        ref.removeEventListener('scroll', handleScroll)
        window.removeEventListener('mousemove', userInteracted)
        window.removeEventListener('touch', userInteracted)
        window.clearTimeout(timer)
    })

    setTimer() // so that just loading the wall will get the animation to start after idle period

    // @ts-ignore
    return <div ref={ref} class={styles.wallViewport}>
        {props.children}
    </div>

}