import { createContext, createResource, ParentProps, Resource, useContext } from "solid-js";

const ContentContext = createContext<Resource<Content>>();

export function ContentProvider(props: ParentProps) {

    const [content] = createResource<Content>(async function f() {
        const response = await fetch(`/content.json`)
        await new Promise(resolve => setTimeout(resolve, 500))
        if (!response.ok) {
            throw Error("ERR")
        }
        return response.json()
    })
    return <ContentContext.Provider value={content}>
        {props.children}
    </ContentContext.Provider>
}

export function useContent() {
    return useContext(ContentContext);
}