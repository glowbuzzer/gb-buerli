import {
    ActivityApiBase,
    ActivityBuilder,
    ActivityStreamItem,
    ACTIVITYTYPE,
    ARCDIRECTION,
    ROTATIONINTERPOLATION
} from "@glowbuzzer/store"
import { Object3D, Quaternion, Vector3 } from "three"
import {
    arcStartEndAngle,
    get_position_for_activity,
    is_valid_rotation,
    update_position_for_activity
} from "./util"
import { ActivityTargetPoint } from "./types"
import { ActivitySequenceItem } from "./store"

/**
 * Create a fake api that will allow us to create activities using the builder pattern.
 * Activities end up as plain Javascript objects, so we can create and manipulate them without the GBR store
 */
const api = new (class extends ActivityApiBase {
    constructor() {
        super(0, {})
    }

    execute(command: any): any {}

    get nextTag(): number {
        return 0
    }
})()

/** make a move, either a straight line or a move to position (joint space) */
export const factoryForMove = (activityType: ACTIVITYTYPE, point: Vector3) => {
    const { x, y, z } = point
    const builder =
        activityType === ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION
            ? api.moveToPosition()
            : api.moveLine()

    builder.translation(x, y, z).frameIndex(0)
    return { activityType, builder }
}

/** make an arc */
export const factoryForArc = (
    selection,
    toEndPoint = true,
    direction: ARCDIRECTION = ARCDIRECTION.ARCDIRECTION_CW
) => {
    const { center, radius, normal, angle } = selection
    const { startVector, endVector } = arcStartEndAngle(selection)
    const target = center.clone().add(toEndPoint ? endVector : startVector)
    const { x, y, z } = target
    const interpolation =
        angle > Math.PI
            ? ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_LONG_SLERP
            : ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_SHORT_SLERP

    const o = new Object3D()
    o.lookAt(normal)
    const q = o.quaternion

    return {
        activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
        builder: api
            .moveArc(x, y, z)
            .centre(center.x, center.y, center.z)
            .radius(radius)
            .plane(q.x, q.y, q.z, q.w)
            .direction(direction)
            .frameIndex(0)
            .rotationInterpolation(interpolation)
    }
}

/** produce different activities for different target end points when a line is selected */
export const targetFactoryForLine = (
    target: ActivityTargetPoint,
    selection
): { activityType: ACTIVITYTYPE; builder: ActivityBuilder }[] => {
    const { start, end } = selection
    const mid = selection.matchingPoints[0][0] || { x: 0, y: 0, z: 0 }
    switch (target) {
        case ActivityTargetPoint.START:
            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, start),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, start)
            ]
        case ActivityTargetPoint.END:
            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, end),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, end)
            ]
        case ActivityTargetPoint.MID:
            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, mid),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, mid)
            ]
    }
}

/** produce different activities for different target end points when an arc is selected */
export const targetFactoryForArc = (
    target: ActivityTargetPoint,
    selection
): { activityType: ACTIVITYTYPE; builder: ActivityBuilder }[] => {
    const { startVector, endVector } = arcStartEndAngle(selection)
    switch (target) {
        case ActivityTargetPoint.START:
            const start = selection.center.clone().add(startVector)

            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, start),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, start),
                factoryForArc(selection, false, ARCDIRECTION.ARCDIRECTION_CW)
            ]
        case ActivityTargetPoint.END:
            const end = selection.center.clone().add(endVector)

            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, end),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, end),
                factoryForArc(selection, true, ARCDIRECTION.ARCDIRECTION_CCW)
            ]
        case ActivityTargetPoint.CENTER:
            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, selection.center),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, selection.center)
            ]
    }
}

/** produce different activities for different target end points when a point is selected */
export const targetFactoryForPoint = (
    target: ActivityTargetPoint,
    selection
): { activityType: ACTIVITYTYPE; builder: ActivityBuilder }[] => {
    const { position } = selection
    switch (target) {
        case ActivityTargetPoint.START:
            return [
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION, position),
                factoryForMove(ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE, position)
            ]
    }
}

/**
 * Generate the final set of activities for a sequence, including approach and retreat for each move, if specified
 */
export function* generateActivitiesForSequence(
    rotation: Quaternion,
    sequence: ActivitySequenceItem[]
): IterableIterator<ActivityStreamItem> {
    for (const item of sequence) {
        const { kinematicsConfigurationIndex, position: target } = get_position_for_activity(
            item.activity
        )
        if (is_valid_rotation(target.rotation)) {
            rotation = new Quaternion().copy(target.rotation as any)
        }
        if (item.approach) {
            // work out the approach position
            // update the position by moving relative in -Z according to rotation
            const vector = new Vector3(0, 0, -item.approach)
            vector.applyQuaternion(rotation)
            const { x, y, z } = new Vector3().copy(target.translation as any).add(vector)

            // yield the new approach position on approach
            yield update_position_for_activity(item.activity, { translation: { x, y, z } })
            // yield a straight line to the target
            yield {
                activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
                moveLine: {
                    kinematicsConfigurationIndex,
                    line: target
                }
            }
        } else {
            yield item.activity
        }
        if (item.retreat) {
            const vector = new Vector3(0, 0, -item.retreat)
            vector.applyQuaternion(rotation)
            const { x, y, z } = new Vector3().copy(target.translation as any).add(vector)

            // yield a straight line away from the target
            yield {
                activityType: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
                moveLine: {
                    kinematicsConfigurationIndex,
                    line: {
                        ...target,
                        translation: { x, y, z }
                    }
                }
            }
        }
    }
}
