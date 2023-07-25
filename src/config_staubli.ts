/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "STAUBLI TX40x",
            busCycleTime: 4
        }
    ],
    stream: [
        {
            name: "default"
        }
    ],
    soloActivity: [
        {
            name: "default"
        }
    ],
    points: [
        {
            name: "default",
            frameIndex: 0,
            configuration: 0,
            translation: {
                x: 0,
                y: 0,
                z: 300
            },
            rotation: {
                x: 0,
                y: 1,
                z: 0,
                w: 0
            }
        }
    ],
    tool: [
        {
            name: "none"
        },
        {
            name: "torch",
            diameter: 10,
            translation: {
                z: 151.75,
                x: 49.29
            },
            rotation: {
                x: 0,
                y: 0.5,
                z: 0,
                w: 0.8660254038
            }
        },
        {
            name: "simple",
            diameter: 3,
            translation: {
                z: 30
            }
        }
    ],
    frames: [
        {
            // frame used for the part on top of the table
            name: "default"
            // translation: {
            //     x: 100,
            //     z: 200
            // }
        },
        {
            name: "robot",
            translation: {
                x: -300,
                y: 0,
                z: 325
            }
        }
    ],
    joint: [
        {
            name: "0",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -180,
            posLimit: 180
        },
        {
            name: "1",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -125,
            posLimit: 125
        },
        {
            name: "2",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -138,
            posLimit: 138
        },
        {
            name: "3",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        },
        {
            name: "4",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -120,
            posLimit: 133.5
        },
        {
            name: "5",
            limits: [
                {
                    vmax: 1,
                    amax: 8,
                    jmax: 160
                }
            ],
            scale: 10000,
            jointType: 1,
            negLimit: -270,
            posLimit: 270
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: 1,
            supportedConfigurationBits: 7,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [-1000, 1000],
            linearLimits: [
                {
                    vmax: 20,
                    amax: 400,
                    jmax: 8000
                }
            ],
            angularLimits: [
                {
                    vmax: 1,
                    amax: 10,
                    jmax: 100
                }
            ],
            kinChainParams: {
                numRows: 6,
                numCols: 5,
                data: [
                    -90, 0, 0, 0, 0,

                    0, 0, -90, 225, 0,

                    90, 0, 90, 0, 35,

                    -90, 0, 0, 0, 225,

                    90, 0, 0, 0, 0,

                    0, 0, 0, 0, 65
                ]
            }
        }
    ],
    fieldbus: [
        {
            name: "0",
            jointCount: 10,
            RxPdo: {
                machineStatusWordOffset: 0,
                activeFaultOffset: 4,
                faultHistoryOffset: 8,
                heartbeatOffset: 12,
                jointStatuswordOffset: 16,
                jointActualPositionOffset: 36,
                jointActualVelocityOffset: 76,
                jointActualTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 8,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            },
            TxPdo: {
                machineControlWordOffset: 0,
                gbcControlWordOffset: 4,
                hlcControlWordOffset: 8,
                heartbeatOffset: 12,
                jointControlwordOffset: 16,
                jointSetPositionOffset: 36,
                jointSetVelocityOffset: 76,
                jointSetTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 10,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            }
        }
    ]
}
