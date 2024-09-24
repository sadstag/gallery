import type { AppliedFilter } from '@model/wall/AppliedFilter'
import type { Sort } from '@model/wall/Sort'
import { useSearchParams } from '@solidjs/router'

const wallParametersParam = '_'

type WallParameters = { filters: AppliedFilter[]; sort: Sort }

export const persistFiltersAndSort = (filters: AppliedFilter[], sort: Sort) => {
	const [searchParams, setSearchParams] = useSearchParams()
	setSearchParams(
		{
			...searchParams,
			[wallParametersParam]: window.btoa(JSON.stringify({ filters, sort } as WallParameters)),
		},
		{ replace: true },
	)
}

export const retrieveFiltersAndSort = (): WallParameters | undefined => {
	const [searchParams] = useSearchParams()

	let wallParameters: WallParameters | undefined

	if (searchParams[wallParametersParam]) {
		try {
			wallParameters = JSON.parse(window.atob(searchParams[wallParametersParam]))
		} catch (_) {
			wallParameters = undefined
		}
	}

	return wallParameters
}
