import { For } from "solid-js"
import { useContent } from "../context/ContentProvider"

function PresentationPage() {

    const content = useContent()

    const paragraphs = () =>
        (content?.()?.presentation ?? '…').split("\n\n").map(
            block => block.split("\n")
        )

    return (
        <For each={paragraphs()}>
            {(lines) =>
                <p>
                    <For each={lines}>
                        {(line) => <>{line}<br /></>}
                    </For>
                </p>
            }
        </For>
    )
}

export default PresentationPage