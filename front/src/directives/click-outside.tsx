// based on  https://www.solidjs.com/tutorial/bindings_directives

import { type Accessor, onCleanup } from 'solid-js'

declare module 'solid-js' {
	// biome-ignore lint/style/noNamespace: <explanation>
	namespace jsx {
		interface DirectiveFunctions {
			clickOutside: typeof clickOutside
		}
	}
}

export function clickOutside(el: HTMLElement, onClickOutside: Accessor<() => void>) {
	const onClick = (e: MouseEvent) => {
		if (el.contains(e.target as Node)) {
			return
		}
		e.preventDefault()
		onClickOutside()?.()
	}
	document.body.addEventListener('click', onClick)
	onCleanup(() => document.body.removeEventListener('click', onClick))
}
