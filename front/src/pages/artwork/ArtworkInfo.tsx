import { For, splitProps } from 'solid-js'
import { Artwork } from '../../model/Artwork'

import styles from './ArtworkPage.module.css'
import { InfoBloc } from './InfoBloc'
import { JSX } from 'solid-js/h/jsx-runtime'
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

    const infos = function () {
        return artworkInfoFields.reduce(
            (acc_infos: Info[], field: keyof Artwork) => {
                const value = artwork[field]
                return value === undefined
                    ? acc_infos
                    : ([
                          ...acc_infos,
                          [i18n(field), getTransformer(field)(value)]
                      ] as Info[])
            },
            [] as Info[]
        )
    }

    // TODO click on bloc =&gt; goto wall altering filter

    return (
        <div class={styles['info-blocs-container']}>
            <For each={infos()}>
                {([label, value]) => <InfoBloc label={label} value={value} />}
            </For>
        </div>
    )
}
