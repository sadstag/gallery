import { type ParentProps, Show } from "solid-js"
import { useWallModel } from "../../../../../context/WallModelProvider";
import type { FilterType } from "../../../../../model/wall/Filter"
import styles from "./modale.module.css"

type Props = ParentProps<{
    filterType: FilterType;
    title: string
}>

export const FilterPanel = ({ filterType, title, children }: Props) => {
    const { wallModel, operations: { removeFilter } } = useWallModel()
    const isSet = () => wallModel.appliedFilters.find(({ on }) => on === filterType) !== undefined

    const classes = () => {
        const cls = [styles.panel]
        if (isSet()) {
            cls.push(styles.filterIsSet)
        }
        return cls.join(' ')
    }

    return <div class={classes()}>
        <h3 class={styles.title}>{title}</h3>
        <div class={styles.content}>{children}</div>
        <Show when={isSet()}>
            <button type="button" class={styles.remove} onClick={() => removeFilter(filterType)}>remove</button>
        </Show>
    </div>

}