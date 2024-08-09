import type { AppliedFilter } from './Filter'
import type { Sort } from './Sort'

export type WallModel = {
	appliedFilters: AppliedFilter[]
	sort: Sort
}
