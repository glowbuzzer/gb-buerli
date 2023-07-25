import { BufferGeometry, Vector3 } from "three"
import { GeometryRenderType } from "../types"
import { Line, Sphere } from "@react-three/drei"

function toVector3(positionsAttribute) {
    return Array.from({ length: positionsAttribute.count }, (_, i) => {
        const x = positionsAttribute.getX(i)
        const y = positionsAttribute.getY(i)
        const z = positionsAttribute.getZ(i)
        return new Vector3(x, y, z)
    })
}

// Use the geometry to render the selected object. Uses a mesh or a line depending on the type
export const GeometryRender = ({
    geometry,
    type
}: {
    geometry: BufferGeometry
    type: GeometryRenderType
}) => {
    switch (type) {
        case GeometryRenderType.MESH:
            return (
                <mesh geometry={geometry}>
                    <meshBasicMaterial color={0xff0000} />
                </mesh>
            )

        case GeometryRenderType.LINE:
            const positionsAttribute = geometry.getAttribute("position")
            const points = toVector3(positionsAttribute)
            const start = points[0]
            const end = points[points.length - 1]

            return (
                <>
                    <Sphere args={[1, 16, 16]} position={start}>
                        <meshBasicMaterial color={0x00ff00} />
                    </Sphere>
                    <Line
                        points={points} // Array of Vector3
                        color="red" // Color
                        lineWidth={3} // Line width
                    />
                    <Sphere args={[1, 16, 16]} position={end}>
                        <meshBasicMaterial color={0xff0000} />
                    </Sphere>
                </>
            )

        case GeometryRenderType.POINT:
        default:
            return null
    }
}
