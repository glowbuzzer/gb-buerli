import { useAppState } from "../store"
import { GeometryRender } from "./GeometryRender"
import { graphicTypeProperties, RenderType, renderTypeFor } from "../types"
import { Sphere } from "@react-three/drei"
import { MeshBasicMaterial } from "three"
import { SelectionProvider } from "../selection/SelectionProvider"

const matchingPointsMaterial = new MeshBasicMaterial({
    color: 0xffff00
})

// Display the current selection, either using the geometry, or a custom "primitive" render based on the type
export const CurrentSelectionSceneDisplay = () => {
    const { selected, showGeometry } = useAppState()

    if (!selected) {
        return null
    }

    const { primitiveRender: Component, geometryRenderType: type } = graphicTypeProperties(
        selected.type
    )

    const { renderType } = renderTypeFor(selected.type, showGeometry)

    const matchingPoints = selected.matchingPoints[0]

    return (
        <SelectionProvider selection={selected}>
            {renderType === RenderType.GEOMETRY ? (
                <GeometryRender geometry={selected.geometry} type={type} />
            ) : Component ? (
                <Component />
            ) : null}
            {matchingPoints?.map((p, i) => (
                <group key={i} position={[p.x, p.y, p.z]}>
                    <Sphere scale={[0.5, 0.5, 0.5]} material={matchingPointsMaterial} />
                </group>
            ))}
        </SelectionProvider>
    )
}
