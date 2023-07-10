import {
    ConnectTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    DockViewMenu,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { Menu } from "antd"
import * as React from "react"
import { useEffect, useState } from "react"
import { Scene } from "./Scene"
import { Vector3 } from "three"
import { init, SocketIOClient } from "@buerli.io/classcad"
import { history, ApiHistory } from "@buerli.io/headless"
import { PathBuilderTile } from "./PathBuilderTile"

init(id => new SocketIOClient("ws://localhost:8081", id), {
    config: { geometry: { points: { hidden: true }, edges: { color: "black" } } }
})
// noinspection JSPotentiallyInvalidConstructorUsage
const cad = new history()

const CustomSceneTileDefinition = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => (
        <ThreeDimensionalSceneTile initialCameraPosition={new Vector3(200, 200, 200)}>
            <Scene />
        </ThreeDimensionalSceneTile>
    ))
    .build()

const PathBuilderTileDefinition = DockTileDefinitionBuilder()
    .id("path-builder")
    .name("Path Builder")
    .render(() => <PathBuilderTile />)
    .enableWithoutConnection()
    .build()

const apiContext = React.createContext<ApiHistory>(null)

export const App = () => {
    const [api, setApi] = useState<ApiHistory>()

    useEffect(() => {
        cad.init(async api => {
            const buffer = await fetch("/Ventil.stp").then(r => r.arrayBuffer())
            await api.load(buffer, "stp")
            console.log("setting api", api)
            setApi(api)
        })
    }, [])

    return (
        <apiContext.Provider value={api}>
            <DockLayoutProvider
                tiles={[
                    ConnectTileDefinition,
                    PathBuilderTileDefinition,
                    CustomSceneTileDefinition
                ]}
            >
                {/* Provide a view menu to show/hide tiles */}
                <Menu mode="horizontal" theme="light" selectedKeys={[]}>
                    <DockViewMenu />
                </Menu>
                {/* The actual docking layout */}
                <DockLayout />
            </DockLayoutProvider>
        </apiContext.Provider>
    )
}

export function useHistoryApiFromContext() {
    return React.useContext(apiContext)
}
