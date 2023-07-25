import * as React from "react"
import { projects } from "./projects"
import { appSlice } from "./store"
import { useDispatch } from "react-redux"
import { Menu } from "antd"
import { useDockViewMenu } from "@glowbuzzer/controls"

export const AppMenu = () => {
    const dispatch = useDispatch()
    const viewMenu = useDockViewMenu()

    function load_project(index: number) {
        dispatch(appSlice.actions.setProject(index))
    }

    const menuItems = [
        {
            key: "file",
            label: "File",
            children: [
                {
                    key: "file-open",
                    label: "Open Project",
                    children: projects.map((project, index) => ({
                        key: "file-open-" + index,
                        label: project.title || project.model,
                        onClick: () => load_project(index)
                    }))
                }
            ]
        },
        viewMenu
    ]
    return <Menu mode="horizontal" theme="light" selectedKeys={[]} items={menuItems} />
}
