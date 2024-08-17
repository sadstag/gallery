import { Portal } from "solid-js/web"
import { Button } from "../../../../../design-system/Button/Button"
import { AvailableFilterPanel } from "./AvailableFilterPanel"
import { IdFilterPanel } from "./IDFilterPanel"
import { TextContentFilterPanel } from "./TextContentFilterPanel"
import { YearFilterPanel } from "./YearFilterPanel"
import styles from "./modale.module.css"

type Props = {
    onClose: () => void
}

export const FiltersEditionModale = ({ onClose }: Props) => {

    return <Portal>
        <div class={styles.modale}>
            <h2>Filters</h2>
            <div class={styles.panels}>
                <AvailableFilterPanel />
                <YearFilterPanel />
                <TextContentFilterPanel />
                <IdFilterPanel />
            </div>
            <Button className={styles.close} onClick={onClose}>close</Button>
        </div>
    </Portal>
}