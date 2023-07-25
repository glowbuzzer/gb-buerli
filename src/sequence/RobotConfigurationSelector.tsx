/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Tag } from "antd"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ReloadOutlined
} from "@ant-design/icons"
import * as React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: inline-block;
    white-space: nowrap;

    .ant-tag {
        cursor: pointer;
    }
`

type RobotConfigurationSelectorProps = {
    /** Current configuration */
    currentValue: number
    /** Edited value */
    value: number
    /** Which configuration bits are allowed (waist, elbow, wrist) */
    supportedConfigurationBits: number
    /** On change handler, called when the user interacts with the control */
    onChange(value: number)
}

// Helper to allow selection of the desired robot configuration (used for joint space moves)
export const RobotConfigurationSelector = ({
    currentValue,
    value,
    supportedConfigurationBits,
    onChange
}: RobotConfigurationSelectorProps) => {
    function test(bit: number) {
        if (value === 255) {
            return currentValue & bit
        }
        return value & bit
    }
    const waist = test(0b100)
    const elbow = test(0b010)
    const wrist = test(0b001)

    const currentWaist = currentValue & 0b100
    const currentElbow = currentValue & 0b010
    const currentWrist = currentValue & 0b001

    function toggle(bit: number) {
        if (value === 255) {
            value = 0
        }
        onChange(value ^ bit)
    }

    const waistSupported = supportedConfigurationBits & 0b100 || null
    const elbowSupported = supportedConfigurationBits & 0b010 || null
    const wristSupported = supportedConfigurationBits & 0b001 || null

    return (
        <StyledDiv>
            {waistSupported && (
                <Tag
                    onClick={() => toggle(0b100)}
                    color={currentWaist !== waist ? "blue" : undefined}
                >
                    Waist {waist ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
                </Tag>
            )}
            {elbowSupported && (
                <Tag
                    onClick={() => toggle(0b010)}
                    color={currentElbow !== elbow ? "blue" : undefined}
                >
                    Elbow {elbow ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                </Tag>
            )}
            {wristSupported && (
                <Tag
                    onClick={() => toggle(0b001)}
                    color={currentWrist !== wrist ? "blue" : undefined}
                >
                    Wrist <ReloadOutlined style={wrist ? { transform: "scaleX(-1)" } : undefined} />
                </Tag>
            )}
        </StyledDiv>
    )
}
