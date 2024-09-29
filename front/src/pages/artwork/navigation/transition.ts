export const finishMovement = (ref: HTMLElement, targetTranslationX: string, then: () => void) => {
	ref.style.transform = `translate(${targetTranslationX},0)`
	ref.style.transition = 'transform 0.3s ease-out'
	ref.ontransitionend = () => {
		// biome-ignore lint/suspicious/noEmptyBlockStatements: possible bad side effects on other transition if ever any
		ref.ontransitionend = () => {}
		ref.style.transition = 'none'
		ref.style.transform = 'none'
		then()
	}
}
