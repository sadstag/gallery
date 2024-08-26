import type { Component } from "solid-js"
import { Dynamic, Index, Portal } from "solid-js/web"
import { useWallModel } from "../../../../../context/WallModelProvider"
import { Button } from "../../../../../design-system/Button/Button"
import type { FilterType, } from "../../../../../model/wall/Filter"
import { AvailableFilterPanel } from "./AvailableFilterPanel"
import { HiddenAtFirstFilterPanel } from "./HiddenAtFirstFilterPanel"
import { IdFilterPanel } from "./IDFilterPanel"
import { TextContentFilterPanel } from "./TextContentFilterPanel"
import { YearFilterPanel } from "./YearFilterPanel"
import styles from "./modale.module.css"

type Props = {
    onClose: () => void
}

const filterPanels: { [T in FilterType]: Component } = {
    'available': AvailableFilterPanel,
    'year': YearFilterPanel,
    'textContent': TextContentFilterPanel,
    'hideArtworksHiddenAtFirst': HiddenAtFirstFilterPanel,
    'id': IdFilterPanel
}

export const FiltersEditionModale = ({ onClose }: Props) => {

    const [_, _2, availableFilters] = useWallModel()

    return <Portal>
        <div class={styles.modale}>
            <h2>Filters</h2>
            <div class={styles.panels}>
                <Index each={availableFilters}>
                    {(filterType) => <Dynamic component={filterPanels[filterType()]} />}
                </Index>
            </div>
            <Button className={styles.close} onClick={onClose}>close</Button>
        </div>
    </Portal>
}