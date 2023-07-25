import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { PathBuilderTile } from "./PathBuilderTile"
import * as React from "react"

export const PathBuilderTileDefinition = DockTileDefinitionBuilder()
    .id("path-builder")
    .name("Path Builder")
    .render(() => <PathBuilderTile />)
    .placement(0, 1)
    .enableWithoutConnection()
    .build()
