import type { Artwork } from '../Artwork'
import type { AppliedFilter, FilterType } from './AppliedFilter'
import type { Sort, SortType } from './Sort'

export type WallModel = {
	availableSorts: SortType[]
	availableFilters: FilterType[]
	appliedFilters: AppliedFilter[]
	sort: Sort
	artworks: Artwork[]
	filteredArtworks: Artwork[]
}
