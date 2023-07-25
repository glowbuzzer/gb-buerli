import {
    DockTileDefinitionBuilder,
    ThreeDimensionalSceneTileDefinition,
    ThreeDimensionalSceneTile,
    TrackPosition,
    TriadHelper,
    CylindricalTool
} from "@glowbuzzer/controls"
import { Scene } from "./Scene"
import { Vector3 } from "three"
import { Frustum } from "./scene/Frustum"
import { StaubliRobot } from "./StaubliRobot"
import { Cylinder, Environment, useGLTF } from "@react-three/drei"
import { WeldingTorch } from "./scene/WeldingTorch"
import { useToolConfig } from "@glowbuzzer/store"

const initialCameraPosition = new Vector3(800, 800, 800)

export const CustomSceneTileDefinition = DockTileDefinitionBuilder(
    ThreeDimensionalSceneTileDefinition
)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile
                initialCameraPosition={initialCameraPosition}
                hideTrace
                noGridHelper
            >
                <Scene />
                <Environment files={`/assets/environment/aerodynamics_workshop_1k.hdr`} />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()
