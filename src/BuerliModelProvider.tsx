import * as React from "react"
import { useEffect, useState } from "react"
import { ApiHistory, history } from "@buerli.io/headless"
import { appSlice, useAppState } from "./store"
import { projects } from "./projects"
import { useDispatch } from "react-redux"
import { MachineState, useConnection, useMachine, useSoloActivity } from "@glowbuzzer/store"

const cad = new history()

const apiContext = React.createContext<ApiHistory>(null)

/**
 * This component is responsible for initializing the Buerli API and loading the model when the selected project changes.
 * It makes the api available to all children via the context, and this is used to access the selectGeometry function.
 */
export const BuerliModelProvider = ({ children }) => {
    const { connected } = useConnection()
    const { currentState } = useMachine()

    const { projectIndex } = useAppState()
    const [api, setApi] = useState<ApiHistory>()
    const solo = useSoloActivity(0)
    const dispatch = useDispatch()

    // reinitialize the api and load the model when selected project changes
    useEffect(() => {
        cad.init(async api => {
            const project = projects[projectIndex]
            const buffer = await fetch("/" + project.model).then(r => r.arrayBuffer())
            await api.load(buffer, "stp")
            dispatch(appSlice.actions.reset())
            setApi(api)
        })
    }, [projectIndex])

    // set the right tool (defined in the project info) when connected and operation enabled, or project changes
    useEffect(() => {
        if (connected && currentState === MachineState.OPERATION_ENABLED) {
            const project = projects[projectIndex]
            solo.setToolOffset(project.toolIndex).promise().catch(console.error)
        }
    }, [connected, currentState, projectIndex])

    return <apiContext.Provider value={api}>{children}</apiContext.Provider>
}

export function useHistoryApiFromContext() {
    return React.useContext(apiContext)
}
