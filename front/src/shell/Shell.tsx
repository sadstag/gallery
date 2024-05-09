import { ParentProps } from "solid-js"

import './Shell.css'
import { ContentProvider } from "../context/ContentProvider"
import { ArtworksDBProvider } from "../context/ArtworksDBProvider"
import { Header } from "./header/Header"
import { Footer } from "./Footer"
import { Body } from "./Body"

export const Shell = (props: ParentProps) => {

    return (
        <ContentProvider>
            <ArtworksDBProvider>
                <div id="shell">
                    <Header />
                    <Body>
                        {props.children}
                    </Body>
                    <Footer />
                </div>
            </ArtworksDBProvider>
        </ContentProvider>
    )
}