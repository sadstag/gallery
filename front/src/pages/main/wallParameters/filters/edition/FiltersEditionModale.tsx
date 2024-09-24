import { useWallModel } from '@context/wall/WallModelProvider'
import { Button } from '@ds/Button/Button'
import type { FilterType } from '@model/wall/AppliedFilter'
import type { Component } from 'solid-js'
import { Dynamic, Index, Portal } from 'solid-js/web'
// @ts-ignore clickOutside is used
// biome-ignore lint/correctness/noUnusedImports: clickOutside is used
import { clickOutside } from '../../../../../directives/click-outside'
import { AvailableFilterPanel } from './AvailableFilterPanel'
import { CategoryFilterPanel } from './CategoryFilterPanel'
import { HiddenAtFirstFilterPanel } from './HiddenAtFirstFilterPanel'
import { IdFilterPanel } from './IdFilterPanel'
import { TextContentFilterPanel } from './TextContentFilterPanel'
import { YearFilterPanel } from './YearFilterPanel'
import styles from './modale.module.css'

type Props = {
	onClose: () => void
}

const filterPanels: { [T in FilterType]: Component } = {
	available: AvailableFilterPanel,
	year: YearFilterPanel,
	textContent: TextContentFilterPanel,
	hideArtworksHiddenAtFirst: HiddenAtFirstFilterPanel,
	id: IdFilterPanel,
	category: CategoryFilterPanel,
}

export const FiltersEditionModale = ({ onClose }: Props) => {
	const { wallModel } = useWallModel()

	return (
		<Portal>
			<div class={styles.modale}>
				<div
					class={styles.wrapper}
					// @ts-ignore
					use:clickOutside={onClose}
				>
					<h2>
						Filters: {wallModel.appliedFilters.length} applied, {wallModel.filteredArtworks.length}/
						{wallModel.artworks.length} artworks displayed
					</h2>
					<div class={styles.panels}>
						<Index each={wallModel.availableFilters}>
							{filterType => <Dynamic component={filterPanels[filterType()]} />}
						</Index>
					</div>
					<Button className={styles.close} onClick={onClose}>
						close
					</Button>
				</div>
			</div>
		</Portal>
	)
}
