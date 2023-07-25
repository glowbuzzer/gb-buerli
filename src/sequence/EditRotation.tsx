import { Euler, Quaternion, Vector3 } from "three"
import { Button, Dropdown, InputNumber, Space } from "antd"
import { DashOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons"
import { graphicTypeProperties } from "../types"
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems"
import { GraphicType } from "@buerli.io/core"
import { lookAt } from "../util"
import { useEffect, useState } from "react"
import { radToDeg } from "three/src/math/MathUtils"
import { useHistoryApiFromContext } from "../BuerliModelProvider"

type EditRotationProps = {
    title: string
    selection
    translation: Vector3
    rotation: Quaternion
    previousRotation: Quaternion
    onChange: (value: Quaternion) => void
}

// Provide a panel to edit the target rotation of a move. The user can select from a list of common rotations, or select a point in the model to look at.
export const EditRotation = ({
    title,
    selection,
    translation,
    rotation,
    previousRotation,
    onChange
}: EditRotationProps) => {
    const api = useHistoryApiFromContext()
    const [selectedOption, setSelectedOption] = useState("none")

    // the rotation can be all nulls which means the target rotation is not specified and will use the existing rotation
    const invalid_rotation = rotation.toArray().some(v => v === null)

    // for display only
    const euler = new Euler().setFromQuaternion(invalid_rotation ? previousRotation : rotation)

    async function select_point() {
        // use Buerli's selection API to select a point in the model
        const info = await api.selectGeometry([GraphicType.POINT])
        const userData = info[0].userData
        const { position } = userData
        const vector = new Vector3().copy(translation as any).sub(position)
        return lookAt(vector)
    }

    function look_at(numbers: number[]) {
        const direction = new Vector3().fromArray(numbers)
        return lookAt(direction)
    }

    // some graphic types have additional rotation options (eg. look at arc centre)
    const rotationOptionsForType = graphicTypeProperties(selection.type).rotationOptions || []

    const items: (ItemType & { quaternion? })[] = [
        {
            key: "point",
            label: "Select Point",
            quaternion: () => select_point()
        },
        {
            key: "none",
            label: "Clear",
            quaternion: () => new Quaternion(null, null, null, null)
        },
        {
            key: "div1",
            type: "divider"
        },
        ...rotationOptionsForType,
        {
            key: "x",
            label: "X",
            quaternion: () => look_at([1, 0, 0])
        },
        {
            key: "-x",
            label: "-X",
            quaternion: () => look_at([-1, 0, 0])
        },
        {
            key: "y",
            label: "Y",
            quaternion: () => look_at([0, 1, 0])
        },
        {
            key: "-y",
            label: "-Y",
            quaternion: () => look_at([0, -1, 0])
        },
        {
            key: "z",
            label: "Z",
            quaternion: () => look_at([0, 0, 1])
        },
        {
            key: "-z",
            label: "-Z",
            quaternion: () => look_at([0, 0, -1])
        }
    ]

    // when the preset option changes, update the rotation
    useEffect(() => {
        const item = items.find(item => item.key === selectedOption)
        if (item?.quaternion) {
            // if we're using the Buerli selection API it's a promise, otherwise it's a plain quaternion,
            // so handle both cases using Promise.resolve
            Promise.resolve(item.quaternion(selection, translation)).then(quaternion =>
                onChange(quaternion)
            )
        }
    }, [selectedOption])

    // convert to menu items, by stripping off the quaternion property and adding an onClick handler
    const menu = items.map(({ quaternion, ...item }) => {
        return {
            ...item,
            onClick: item["onClick"] || (() => setSelectedOption(item.key as string))
        }
    })

    return (
        <>
            <div>{title}</div>
            <>
                {" "}
                {["x", "y", "z"].map(axis => (
                    <div className="input" key={axis}>
                        R{axis}{" "}
                        <InputNumber
                            value={radToDeg(euler[axis]).toFixed(2)}
                            size="small"
                            disabled
                        />
                    </div>
                ))}
            </>
            <Dropdown menu={{ items: menu }} trigger={["click"]}>
                <DashOutlined rotate={90} />
            </Dropdown>
        </>
    )
}
