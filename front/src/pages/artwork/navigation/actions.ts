export type ActionType = 'top' | 'left' | 'right'

export type Actions = {
	[Action in ActionType]: () => void
}
