/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { ActivityStreamItem } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"

/** A single item in the activity sequence that is being created */
export type ActivitySequenceItem = {
    id: string
    selection: any
    activity: ActivityStreamItem
    preview?: boolean
    approach?: number
    retreat?: number
}

/** The state of the application */
type AppState = {
    projectIndex: number
    selected: any
    showGeometry: boolean
    sequence: ActivitySequenceItem[]
}

/** The redux slice for the application state */
export const appSlice = createSlice({
    name: "buerli",
    initialState: {
        projectIndex: 0,
        selected: null,
        showGeometry: true,
        sequence: []
    },
    reducers: {
        reset(state) {
            state.selected = null
            state.sequence = []
        },
        setProject(state, action: PayloadAction<number>) {
            state.projectIndex = action.payload
        },
        setSelected(state, action: PayloadAction<any>) {
            state.selected = action.payload
        },
        clearSelection(state) {
            state.selected = null
        },
        setShowGeometry(state, action: PayloadAction<boolean>) {
            state.showGeometry = action.payload
        },
        addActivity(state, action: PayloadAction<ActivitySequenceItem>) {
            state.sequence = [
                ...state.sequence.map(item => ({
                    ...item,
                    preview: false
                })),
                action.payload
            ]
        },
        removeActivity(state, action: PayloadAction<string>) {
            state.sequence = state.sequence.filter(item => item.id !== action.payload)
        },
        removeAllActivities(state) {
            state.sequence = state.sequence.filter(() => false)
        },
        updateActivity(state, action: PayloadAction<ActivitySequenceItem>) {
            state.sequence = state.sequence.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        },
        updateActivityStreamItem(
            state,
            action: PayloadAction<{ index: number; activity: ActivityStreamItem }>
        ) {
            state.sequence = state.sequence.map((item, index) => {
                if (index === action.payload.index) {
                    return {
                        ...item,
                        activity: action.payload.activity
                    }
                }
                return item
            })
        },
        setPreview(state, action: PayloadAction<{ id: string; preview: boolean }>) {
            state.sequence = state.sequence.map(item => {
                return {
                    ...item,
                    preview: item.id === action.payload.id ? action.payload.preview : false
                }
            })
        },
        cancelPreview(state) {
            state.sequence = state.sequence.map(item => ({
                ...item,
                preview: false
            }))
        }
    }
})

// Boilerplate to make the store work
export const appReducers = { app: appSlice.reducer }
const combinedAppReducer = combineReducers(appReducers)
type RootState = ReturnType<typeof combinedAppReducer>

export function useAppState() {
    return useSelector<RootState, AppState>(state => state.app)
}
