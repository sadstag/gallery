import type { JSX } from "solid-js"

type Props = {
    classList: JSX.HTMLAttributes<unknown>['classList']
}

export function SortIcon(props: Props) {
    return (
        <svg
            version="1.1"
            viewBox="0 0 6 6"
            fill="white"
            classList={props.classList}
        >
            <title>Menu icon</title>
            <rect id="r" x="0" y="0" rx="0.2" ry="0.2" width="2" height="1" />
            <rect id="r" x="0" y="2" rx="0.2" ry="0.2" width="4" height="1" />
            <rect id="r" x="0" y="4" rx="0.2" ry="0.2" width="6" height="1" />
        </svg>
    )
}