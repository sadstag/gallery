import type { JSX } from "solid-js"

type Props = {
    classList: JSX.HTMLAttributes<unknown>['classList']
}

export function FilterIcon(props: Props) {
    return (
        <svg
            version="1.1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="miter"
            viewBox="0 0 24 24"
            classList={props.classList}
        >
            <title>Filter icon</title>
            <polygon points="22 4.5 14 14 14 22 10 22 10 14 2 4.5 2 2 22 2 22 4.5" />
        </svg>
    )
}

