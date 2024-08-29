import {
    type ParentProps,
    type Resource,
    createContext,
    createResource,
    useContext
} from 'solid-js'

import type { Content } from '../model/Content'

const ContentContext = createContext<Resource<Content>>()

export function ContentProvider(props: ParentProps) {
    const [content] = createResource<Content>(async function f() {
        const response = await fetch('/content.json')
        if (!response.ok) {
            throw Error('ERR')
        }
        return response.json()
    })
    return (
        <ContentContext.Provider value={content}>
            {props.children}
        </ContentContext.Provider>
    )
}

export function useContent() {
    return useContext(ContentContext)
}
