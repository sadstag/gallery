import { produce } from 'solid-js/store'

export const sortTypes = ['defaultSort', 'year', 'area'] as const

export const sortTypeLabels: { [T in SortType]: string } = {
	defaultSort: 'author sort',
	year: 'year',
	area: 'area',
}

export const preferedDirectionForSortType: { [T in SortType]: SortDirection } = {
	defaultSort: 'asc',
	year: 'desc',
	area: 'desc',
}

export type SortType = (typeof sortTypes)[number]
export type SortDirection = 'asc' | 'desc'

export type Sort = {
	on: SortType
	direction: SortDirection
}

export const invertDirection: (sort: Sort) => Sort = produce(sort => {
	sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
})
