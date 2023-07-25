import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    JointJogTileDefinition,
    PointsTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import * as React from "react"
import { init, SocketIOClient } from "@buerli.io/classcad"
import { CustomSceneTileDefinition } from "./CustomSceneTileDefinition"
import { PathBuilderTileDefinition } from "./tiles/PathBuilderTileDefinition"
import { ActivitySequenceTileDefinition } from "./tiles/ActivitySequenceTileDefinition"
import { appReducers } from "./store"
import { config } from "./config_staubli"
import { AppMenu } from "./AppMenu"
import { BuerliModelProvider } from "./BuerliModelProvider"
import { useEffect } from "react"
import { usePrefs } from "@glowbuzzer/store"

init(id => new SocketIOClient("ws://localhost:8081", id), {
    config: { geometry: { points: { hidden: true }, edges: { color: "black" } } }
})

const PrefsOverride = () => {
    // force angular units to be degrees
    const prefs = usePrefs()
    useEffect(() => {
        prefs.update("units_angular", "deg")
    }, [])
    return null
}

export const App = () => {
    return (
        <GlowbuzzerApp appName={"myapp"} additionalReducers={appReducers} configuration={config}>
            <PrefsOverride />
            <BuerliModelProvider>
                <DockLayoutProvider
                    tiles={[
                        ConnectTileDefinition,
                        FeedRateTileDefinition,
                        PathBuilderTileDefinition,
                        ActivitySequenceTileDefinition,
                        CustomSceneTileDefinition,
                        CartesianJogTileDefinition,
                        JointJogTileDefinition,
                        CartesianDroTileDefinition,
                        PointsTileDefinition,
                        ToolsTileDefinition,
                        FramesTileDefinition
                    ]}
                >
                    <AppMenu />
                    <DockLayout />
                </DockLayoutProvider>
            </BuerliModelProvider>
        </GlowbuzzerApp>
    )
}
