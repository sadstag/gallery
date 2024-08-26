import { Show, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { MenuIcon } from '../../design-system/Icon/MenuIcon'
// @ts-ignore clickOutside is used
// biome-ignore lint/correctness/noUnusedImports: clickOutside is used
import clickOutside from '../../directives/click-outside'
import styles from './Menu.module.css'

export function Menu() {
    const [shown, setShown] = createSignal(false)

    const onSelectItem = () => {
        setShown(false)
    }

    const menuIconClasses = () => ({
        [styles['menu-icon']]: true,
        [styles['menu-is-shown']]: shown()
    })

    return (
        <>
            <MenuIcon
                classList={menuIconClasses()}
                onClick={() => setShown((shown) => !shown)}
            />
            <Show when={shown()}>
                <Portal>
                    <div
                        class={styles.menu}
                        use:clickOutside={() => setShown(false)}
                    >
                        <a href="/" onClick={onSelectItem}>
                            <div class={styles['menu-item']}>Artworks</div>
                        </a>
                        <a href="/presentation" onClick={onSelectItem}>
                            <div class={styles['menu-item']}>Presentation</div>
                        </a>
                    </div>
                </Portal>
            </Show>
        </>
    )
}
