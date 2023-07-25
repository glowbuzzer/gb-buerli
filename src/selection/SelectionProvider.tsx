import { createContext, useContext } from "react"

const selectionContext = createContext(null)

// Provides a way to override the currently selected item from the store

export const SelectionProvider = ({ children, selection }) => {
    return <selectionContext.Provider value={selection}>{children}</selectionContext.Provider>
}

export function useSelected() {
    return useContext(selectionContext)
}
