
import { Show, createSignal } from "solid-js"
import { Portal } from "solid-js/web"
import { useWallModel } from "../../../../context/WallModelProvider"
import styles from './filters.module.css'


export const AddFilterButton = () => {

    const [showFilterCreationModale, setShowFilterCreationModale] = createSignal(false)

    const { addNewFilter } = useWallModel()

    const handleAdd = () => {
        addNewFilter({
            on: 'textContent',
            value: { contains: "les" }
        })
        setShowFilterCreationModale(false)
    }

    return <>
        <button type="button" onClick={() => setShowFilterCreationModale(true)}>add</button>
        <Show when={showFilterCreationModale()}>
            <Portal>
                <div class={styles.addFilterModale}>
                    <h1>Modale</h1>
                    <p>Filter creation.</p>
                    <button type="button" onClick={handleAdd}>ADD</button>
                    <button type="button" onClick={() => setShowFilterCreationModale(false)}>close</button>
                </div>
            </Portal>
        </Show>
    </>
}