import type { JSX } from 'solid-js'

type Props = {
	classList: JSX.HTMLAttributes<unknown>['classList']
}

export function MenuIcon(props: Props) {
	return (
		<svg version="1.1" viewBox="0 0 5 5" fill="white" classList={props.classList}>
			<title>Menu icon</title>
			<defs>
				<rect id="r" x="0" y="0" rx="0.2" ry="0.2" width="5" height="1" />
			</defs>
			<use href="#r" />
			<use href="#r" y="2" />
			<use href="#r" y="4" />
		</svg>
	)
}
