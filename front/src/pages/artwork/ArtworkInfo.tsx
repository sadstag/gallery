import { For, splitProps } from 'solid-js'
import type { Artwork } from '../../model/Artwork'

import type { JSX } from 'solid-js/h/jsx-runtime'
import styles from './ArtworkPage.module.css'
import { InfoBloc } from './InfoBloc'
type Props = {
    artwork: Artwork
}

type Info = [string, string]

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

const defaultTransformer: (v: any) => string = (v) => v.toString()

const lengthTransformer: (v: number) => string = (v) => `${v} cm`

const fieldValueTransformers: {
    [field in keyof Partial<Artwork>]: (value: any) => JSX.Element
} = {
    width: lengthTransformer,
    height: lengthTransformer,
    depth: lengthTransformer,
    available: (v: boolean) => (
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
