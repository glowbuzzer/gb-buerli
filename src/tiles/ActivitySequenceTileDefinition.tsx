import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { PathBuilderTile } from "./PathBuilderTile"
import * as React from "react"
import { ActivitySequenceTile } from "./ActivitySequenceTile"

export const ActivitySequenceTileDefinition = DockTileDefinitionBuilder()
    .id("activity-sequence")
    .name("Activity Sequence")
    .render(() => <ActivitySequenceTile />)
    .enableWithoutConnection()
    .build()
