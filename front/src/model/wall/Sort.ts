type SortOn = 'id' | 'author_sort' | 'surface'
type SortOrder = 'asc' | 'desc'

export type Sort = {
	on: SortOn
	order: SortOrder
}
