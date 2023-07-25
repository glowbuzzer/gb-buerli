import { GraphicType } from "@buerli.io/core"
import { PrimitiveCone } from "./scene/PrimitiveCone"
import { PanelForCone } from "./selection/PanelForCone"
import { PanelForArc } from "./selection/PanelForArc"
import { PanelForLine } from "./selection/PanelForLine"
import { PanelForCylinder } from "./selection/PanelForCylinder"
import { PrimitiveCylinder } from "./scene/PrimitiveCylinder"
import { PrimitiveArc } from "./scene/PrimitiveArc"
import { ActivityBuilder, ACTIVITYTYPE } from "@glowbuzzer/store"
import { targetFactoryForArc, targetFactoryForLine, targetFactoryForPoint } from "./activities"
import { lookAt } from "./util"
import { Quaternion, Vector3 } from "three"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { createElement } from "react"

export enum RenderType {
    GEOMETRY = "Geometry",
    PRIMITIVE = "Primitive"
}

export enum GeometryRenderType {
    NONE,
    MESH,
    LINE,
    POINT
}

export enum ActivityTargetPoint {
    START = "Start Point",
    END = "End Point",
    MID = "Midpoint",
    CENTER = "Center"
}

type GraphicTypeSupport = {
    /** render the primitive */
    primitiveRender?: () => JSX.Element
    /** render the properties panel */
    propertiesPanel?: () => JSX.Element
    /** how to render the geometry (mesh, line) */
    geometryRenderType: GeometryRenderType
    /** produces different activities for different target end points */
    activityFactory?: (
        target: ActivityTargetPoint,
        selection
    ) => { activityType: ACTIVITYTYPE; builder: ActivityBuilder }[]
    /** additional rotation options for some object types */
    rotationOptions?: (ItemType & {
        quaternion: (selection: any, from: Vector3) => Quaternion
    })[]
}

/** Graphic type support (selected in the model) */
const types: Partial<Record<GraphicType, GraphicTypeSupport>> = {
    [GraphicType.CONE]: {
        primitiveRender: PrimitiveCone,
        propertiesPanel: PanelForCone,
        geometryRenderType: GeometryRenderType.MESH
    },
    [GraphicType.CYLINDER]: {
        primitiveRender: PrimitiveCylinder,
        propertiesPanel: PanelForCylinder,
        geometryRenderType: GeometryRenderType.MESH
    },
    [GraphicType.PLANE]: {
        geometryRenderType: GeometryRenderType.MESH
    },
    [GraphicType.ARC]: {
        propertiesPanel: PanelForArc,
        primitiveRender: PrimitiveArc,
        geometryRenderType: GeometryRenderType.LINE,
        activityFactory: targetFactoryForArc,
        rotationOptions: [
            {
                key: "arc-towards-center",
                label: "Towards Center",
                quaternion: (selection: any, from: Vector3) => {
                    const vector = selection.center.clone().sub(from).normalize()
                    return lookAt(vector)
                }
            },
            {
                key: "arc-away-from-center",
                label: "Away From Center",
                quaternion: (selection: any, from: Vector3) => {
                    const vector = from.clone().sub(selection.center).normalize()
                    return lookAt(vector)
                }
            }
        ]
    },
    [GraphicType.LINE]: {
        propertiesPanel: PanelForLine,
        geometryRenderType: GeometryRenderType.LINE,
        activityFactory: targetFactoryForLine
    },
    [GraphicType.POINT]: {
        // point can only be rendered by primitive (using position)
        geometryRenderType: GeometryRenderType.NONE,
        activityFactory: targetFactoryForPoint
    }
}

export function graphicTypeProperties(type: GraphicType) {
    return {
        propertiesPanel: () => createElement("div", {}, ["No properties panel available"]),
        geometryRenderType: GeometryRenderType.LINE,
        ...types[type]
    }
}

export function renderTypeFor(type: GraphicType, showGeometry: boolean) {
    const { primitiveRender, geometryRenderType } = graphicTypeProperties(type)

    const geometrySupported = geometryRenderType !== GeometryRenderType.NONE
    const primitiveSupported = !!primitiveRender

    const renderType =
        geometrySupported && (showGeometry || !primitiveSupported)
            ? RenderType.GEOMETRY
            : RenderType.PRIMITIVE

    return {
        renderType,
        geometrySupported,
        primitiveSupported
    }
}
