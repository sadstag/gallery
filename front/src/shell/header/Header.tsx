import { useContent } from "../../context/ContentProvider"
import styles from './Header.module.css'
import { Menu } from "./Menu"

export function Header() {
    const content = useContent()

    return <div class={styles.header}>
        <h1>{content?.()?.title || '???'}
            <span class={styles.subtitle}>{content?.()?.subtitle || ''}</span>
        </h1>

        <Menu />
    </div>
}