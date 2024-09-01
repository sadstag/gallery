import { WallModelProvider } from "../../context/wall/WallModelProvider"
import { ArtworkPage } from "./ArtworkPage"

export const ArtworkPageWillWallModel = () => {
    return <WallModelProvider><ArtworkPage /></WallModelProvider>
}