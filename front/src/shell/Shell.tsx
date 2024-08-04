import type { ParentProps } from "solid-js"

import './Shell.css'
import { ArtworkImagesDBProvider } from "../context/ArtworkImagesDBProvider"
import { ArtworksDBProvider } from "../context/ArtworksDBProvider"
import { ContentProvider } from "../context/ContentProvider"
import { Body } from "./Body"
import { Footer } from "./Footer"
import { Header } from "./header/Header"

export const Shell = (props: ParentProps) => {

    return (
        <ContentProvider>
            <ArtworksDBProvider>
                <ArtworkImagesDBProvider>
                    <div id="shell">
                        <Header />
                        <Body>
                            {props.children}
                        </Body>
                        <Footer />
                    </div>
                </ArtworkImagesDBProvider>
            </ArtworksDBProvider>
        </ContentProvider>
    )
}