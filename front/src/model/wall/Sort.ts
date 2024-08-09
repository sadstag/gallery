import { produce } from 'solid-js/store'

export const sortTypes = ['id', 'year', 'authorSort', 'area'] as const

export type SortType = (typeof sortTypes)[number]
export type SortDirection = 'asc' | 'desc'

export type Sort = {
	on: SortType
	direction: SortDirection
}

export const invertDirection: (sort: Sort) => Sort = produce(sort => {
	sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
})
