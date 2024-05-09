// based on  https://www.solidjs.com/tutorial/bindings_directives

import { Accessor, onCleanup } from "solid-js";

declare module "solid-js" {
    namespace JSX {
        interface DirectiveFunctions {
            clickOutside: typeof clickOutside;
        }
    }
}


export default function clickOutside(el: HTMLElement, onClickOutside: Accessor<() => void>) {
    const onClick = (e: MouseEvent) => {
        if (el.contains(e.target as Node)) {
            return;
        }
        e.preventDefault()
        onClickOutside()?.();
    }
    document.body.addEventListener("click", onClick);
    onCleanup(() => document.body.removeEventListener("click", onClick));
}