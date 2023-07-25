import { useAppState } from "../store"
import { PrimitiveOriginAxis } from "./PrimitiveOriginAxis"
import { selectedMeshMaterial } from "./materials"
import { TriadHelper } from "@glowbuzzer/controls"
import { useMemo } from "react"
import { DoubleSide, Shape, ShapeGeometry, Vector3 } from "three"
import { arcStartEndAngle } from "../util"
import { Line } from "@react-three/drei"

const material = selectedMeshMaterial.clone()
material.side = DoubleSide

// Renders an arc using the info in the selected object.
export const PrimitiveArc = () => {
    const { selected } = useAppState()

    const { radius, center, normal } = selected

    const { startAngle, endAngle, startVector, endVector } = arcStartEndAngle(selected)

    // create the geometry
    const geometry = useMemo(() => {
        const shape = new Shape()
        shape.moveTo(0, 0)
        shape.absarc(0, 0, radius, startAngle, endAngle, false)
        shape.lineTo(0, 0)

        return new ShapeGeometry(shape)
    }, [selected])

    // we want to display the start and end vectors as lines
    const start = new Vector3().copy(center).add(startVector)
    const end = new Vector3().copy(center).add(endVector)

    return (
        <>
            <PrimitiveOriginAxis origin={center} axis={normal}>
                <mesh geometry={geometry} material={material} />
                <TriadHelper size={10} />
            </PrimitiveOriginAxis>
            <Line points={[center, start]} color="green" linewidth={4} />
            <Line points={[center, end]} color="red" linewidth={4} />
        </>
    )
}
