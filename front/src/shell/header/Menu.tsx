import { Portal, Show } from 'solid-js/web'
import styles from './Menu.module.css'
import { createSignal } from 'solid-js'
// @ts-ignore clickOutside is used
import clickOutside from "../../directives/click-outside"

export function Menu() {

    const [shown, setShown] = createSignal(false)

    const onSelectItem = () => {
        setShown(false)
    }

    return (
        <>
            <div class={styles.menuIcon} onClick={() => setShown(shown => !shown)}>Menu</div>
            <Show when={shown()}>
                <Portal>
                    <div class={styles.menu} use:clickOutside={() => setShown(false)}>
                        <a href="/" onClick={onSelectItem}>main</a>
                        <a href="/presentation" onClick={onSelectItem}>pres</a>
                    </div>
                </Portal>
            </Show>
        </>
    )
}