import { Matrix4, Object3D, Quaternion, Vector3 } from "three"
import { ActivityStreamItem, ACTIVITYTYPE, CartesianPosition, Quat } from "@glowbuzzer/store"
import { ActivitySequenceItem } from "./store"

function applyNormal(vector: Vector3, normal: Vector3) {
    const o = new Object3D()
    o.lookAt(normal)
    return vector.clone().applyQuaternion(o.quaternion.invert())
}

function getArcStartAndEnd(center: Vector3, midPoint: Vector3, normal: Vector3, angle: number) {
    // Create a vector from the center to the mid-point
    const midVector = midPoint.clone().sub(center)

    // Rotate midVector by -angle/2 and angle/2 to get start and end vectors
    const startVector = midVector.clone().applyAxisAngle(normal, -angle / 2)
    const endVector = midVector.clone().applyAxisAngle(normal, angle / 2)

    const sv = applyNormal(startVector, normal)
    const ev = applyNormal(endVector, normal)

    // Calculate angles in local x-y plane
    const startAngle = Math.atan2(sv.y, sv.x)
    const endAngle = Math.atan2(ev.y, ev.x)

    return { startAngle, endAngle, startVector, endVector }
}

export function arcStartEndAngle(selected) {
    const { center, angle, matchingPoints, normal } = selected
    const mid_point = matchingPoints[0][0] || { x: 0, y: 0, z: 0 }
    const { startAngle, endAngle, startVector, endVector } = getArcStartAndEnd(
        new Vector3().copy(center),
        new Vector3().copy(mid_point),
        new Vector3().copy(normal),
        angle
    )

    return {
        startAngle,
        endAngle,
        midPoint: new Vector3().copy(mid_point),
        startVector,
        endVector
    }
}

export function lookAt(zaxis: Vector3): Quaternion {
    // by default we will show the xaxis pointing down
    const xaxis = new Vector3(0, 0, -1)
    const yaxis = new Vector3().crossVectors(zaxis, xaxis)

    if (yaxis.length() < 0.0001) {
        // If the X and Z axis are parallel, set the X axis to be parallel to world Y axis
        xaxis.set(0, 1, 0)
        // Recalculate the Y axis to be orthogonal to the new X and Z axes
        yaxis.crossVectors(xaxis, zaxis)
        yaxis.negate()
        const m4 = new Matrix4().makeBasis(xaxis, yaxis, zaxis)
        return new Quaternion().setFromRotationMatrix(m4)
    }

    const m4 = new Matrix4().makeBasis(xaxis, yaxis, zaxis)
    return new Quaternion().setFromRotationMatrix(m4)
}

/** Helper to get the position for an activity directly from the activity object */
export function get_position_for_activity(activity: ActivityStreamItem): {
    kinematicsConfigurationIndex: number
    position: CartesianPosition
} {
    switch (activity.activityType) {
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            return {
                kinematicsConfigurationIndex: activity.moveLine.kinematicsConfigurationIndex,
                position: activity.moveLine.line
            }
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            return {
                kinematicsConfigurationIndex: activity.moveToPosition.kinematicsConfigurationIndex,
                position: activity.moveToPosition.cartesianPosition.position
            }
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
            return {
                kinematicsConfigurationIndex: activity.moveArc.kinematicsConfigurationIndex,
                position: activity.moveArc.arc.destination
            }
        default:
            throw new Error("Unsupported activity type: " + ACTIVITYTYPE[activity.activityType])
    }
}

/** Helper to set the position for an activity directly on the activity object, returning a cloned and modified activity */
export function update_position_for_activity(
    activity: ActivityStreamItem,
    position: CartesianPosition
): ActivityStreamItem {
    const copy = JSON.parse(JSON.stringify(activity))
    switch (activity.activityType) {
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            copy.moveLine.line = {
                ...copy.moveLine.line,
                ...position
            }
            break
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            copy.moveToPosition.cartesianPosition.position = {
                ...copy.moveToPosition.cartesianPosition.position,
                ...position
            }
            break
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
            copy.moveArc.arc.destination = {
                ...copy.moveArc.arc.destination,
                ...position
            }
            break
        default:
            throw new Error("Unknown activity type: " + ACTIVITYTYPE[activity.activityType])
    }
    return copy
}

export function is_valid_rotation(q: Quat) {
    return q.x !== null && q.y !== null && q.z !== null && q.w !== null
}

/**
 * Determine the position (translation and rotation) based on the previous activities in the sequence.
 * Keep working backwards until we find a valid rotation (will use the current robots rotation if nothing else is found)
 */
export function calc_previous_position(
    sequence: ActivitySequenceItem[],
    index: number,
    current: Quat = { x: null, y: null, z: null, w: null }
) {
    const result: CartesianPosition = {
        // don't care about translation for now
        translation: { x: null, y: null, z: null },
        rotation: current
    }
    while (index > 0) {
        index--
        const { position } = get_position_for_activity(sequence[index].activity)
        if (is_valid_rotation(position.rotation)) {
            result.rotation = position.rotation
            break
        }
    }
    return result
}

export function clone(item: ActivitySequenceItem): ActivitySequenceItem {
    return {
        ...item,
        activity: JSON.parse(JSON.stringify(item.activity))
    }
}

export function set_rotation(item: ActivitySequenceItem, quaternion: Quaternion) {
    const { x, y, z, w } = quaternion
    switch (item.activity.activityType) {
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            item.activity.moveLine.line.rotation = { x, y, z, w }
            break
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            item.activity.moveToPosition.cartesianPosition.position.rotation = { x, y, z, w }
            break
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
            item.activity.moveArc.arc.destination.rotation = { x, y, z, w }
            break
    }
}

export function random_id() {
    return Math.random().toString(36).substring(7)
}
