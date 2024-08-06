import { For, splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import type { Artwork } from '../../model/Artwork'

import styles from './ArtworkPage.module.css'
import { InfoBloc } from './InfoBloc'

type Props = {
    artwork: Artwork
}

type Info = [string, JSX.Element]

type ValueType = string | number | boolean | undefined

type ValueTransformer = (value: ValueType) => string

// placeholder
function i18n(field: string): string {
    return field
}

const artworkInfoFields: (keyof Artwork)[] = [
    'year',
    'width',
    'height',
    'depth',
    'support',
    'technic',
    'remarks',
    'available'
]



const defaultTransformer: ValueTransformer = (v) => v?.toString() ?? '?'

const lengthTransformer: ValueTransformer = (v) => `${v} cm`

const fieldValueTransformers: {
    [Field in keyof Partial<Artwork>]: (value: ValueType) => JSX.Element
} = {
    width: lengthTransformer,
    height: lengthTransformer,
    depth: lengthTransformer,
    available: (v: ValueType) => (
        <span class={styles[v ? 'available' : 'not-available']}>
            {i18n(v ? 'yes' : 'no')}
        </span>
    )
}

const getTransformer = (field: keyof Artwork) =>
    fieldValueTransformers[field] ?? defaultTransformer

export function ArtworkInfo(props: Props) {
    const [{ artwork }] = splitProps(props, ['artwork'])

    const infos = () =>
        artworkInfoFields.reduce(
            (accInfos: Info[], field: keyof Artwork) => {
                const value = artwork[field]
                if (value !== undefined) {
                    accInfos.push([i18n(field), getTransformer(field)(value)])
                }
                return accInfos
            },
            [] as Info[]
        )


    // TODO click on bloc =&gt; goto wall altering filter

    return (
        <div class={styles['info-blocs-container']}>
            <For each={infos()}>
                {([label, value]) => <InfoBloc label={label} value={value} />}
            </For>
        </div>
    )
}
