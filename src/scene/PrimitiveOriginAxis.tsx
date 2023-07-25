import { Euler, Object3D, Vector3 } from "three"
import { useMemo } from "react"

// Helper component to orientate a group to a given origin and axis
export const PrimitiveOriginAxis = ({ origin, axis, children }) => {
    const quaternion = useMemo(() => {
        const o = new Object3D()
        o.lookAt(axis)

        return o.quaternion
    }, [origin, axis])

    return (
        <group position={origin} quaternion={quaternion}>
            {children}
        </group>
    )
}
