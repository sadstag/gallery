
import { Show, createSignal } from "solid-js"
import { Portal } from "solid-js/web"
import type { AppliedFilter } from "../../../../model/wall/Filter"

type Props = {
    onNewFilter: (filter: AppliedFilter) => void
}

export const AddFilterButton = ({ onNewFilter }: Props) => {

    const [showFilterCreationModale, setShowFilterCreationModale] = createSignal(false)

    return <>
        <button type="button" onClick={() => setShowFilterCreationModale(true)}>add</button>
        <Show when={showFilterCreationModale()}>
            <Portal>
                <div class="modale">
                    <h1>Modale</h1>
                    <p>Filter creation.</p>
                    <button type="button" onClick={() => setShowFilterCreationModale(false)}>close</button>
                </div>
            </Portal>
        </Show>
    </>
}