import type { ArtworkId } from '../Base'
import type { AppliedFilters } from './Filter'
import type { Sort } from './Sort'

export type WallModel = {
	filtered: ArtworkId[]
	sort: Sort
	filters: AppliedFilters
}
