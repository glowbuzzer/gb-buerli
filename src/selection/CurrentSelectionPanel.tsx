import { appSlice, useAppState } from "../store"
import { Card, Dropdown, List, MenuProps, Space, Tag } from "antd"
import { useDispatch } from "react-redux"
import { ActivityTargetPoint, graphicTypeProperties, RenderType, renderTypeFor } from "../types"
import { CheckOutlined, MenuOutlined } from "@ant-design/icons"
import { SelectionProvider } from "./SelectionProvider"
import { SelectedObjectSupportedMoves } from "./SelectedObjectSupportedMoves"

// This panel displays information about the currently selected geometry in the model, and allows the user to add moves to the sequence
export const CurrentSelectionPanel = () => {
    const { selected, showGeometry } = useAppState()
    const dispatch = useDispatch()

    if (!selected) {
        return null
    }

    // each graphic type can have a different properties panel
    const { propertiesPanel: PropertiesPanelForType } = graphicTypeProperties(selected.type)

    // the render type determines how the geometry is displayed in the scene (using the geometry or a primitive)
    const { renderType, geometrySupported, primitiveSupported } = renderTypeFor(
        selected.type,
        showGeometry
    )

    function set_render_type(type: RenderType) {
        dispatch(appSlice.actions.setShowGeometry(type === RenderType.GEOMETRY))
    }

    const supported_renders = [geometrySupported, primitiveSupported]

    // configure the menu where the user can select geometry vs primitive based on what is supported
    const geometry_items = Object.values(RenderType).map((type, index) => ({
        key: type,
        label: type,
        icon: <CheckOutlined style={{ visibility: type === renderType ? "visible" : "hidden" }} />,
        disabled: !supported_renders[index],
        onClick: () => set_render_type(type)
    }))

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: "Display Using",
            type: "group",
            children: geometry_items
        }
    ]

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Card
                title={selected.type.toUpperCase()}
                size="small"
                extra={
                    <>
                        <Tag color="purple">{renderType}</Tag>
                        <Dropdown menu={{ items }} trigger={["click"]}>
                            <MenuOutlined />
                        </Dropdown>
                    </>
                }
            >
                <SelectionProvider selection={selected}>
                    <PropertiesPanelForType />
                </SelectionProvider>
            </Card>
            <List
                header={<div>Supported Moves</div>}
                bordered
                size="small"
                dataSource={Object.values(ActivityTargetPoint)}
                renderItem={target => (
                    <SelectedObjectSupportedMoves selection={selected} target={target} />
                )}
            />
        </Space>
    )
}
