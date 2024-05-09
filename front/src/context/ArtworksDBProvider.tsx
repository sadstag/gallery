import { createContext, createResource, ParentProps, Resource, useContext } from "solid-js";
import { Artwork } from "../model/Artwork";

type ArtworksDB = {
    meta: {
        generated: string;
        source: string;
    },
    artworks: Artwork[]
}


const ArtworksDBContext = createContext<Resource<ArtworksDB>>();

export function ArtworksDBProvider(props: ParentProps) {

    const [artworks] = createResource<ArtworksDB>(async function f() {
        const response = await fetch(`/artworks.json`)
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (!response.ok) {
            throw Error("ERR")
        }
        return response.json()
    })
    return <ArtworksDBContext.Provider value={artworks}>
        {props.children}
    </ArtworksDBContext.Provider>
}

export function useArtworksDB() {
    return useContext(ArtworksDBContext);
}