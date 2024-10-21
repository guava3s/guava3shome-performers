import {StageScene} from "./Stage";

export interface RTActionFrameDesc {
    id: string
    type: string
}


export interface RTScenePosition {
    index: number
    scene: StageScene
}

export type RTSceneUpdateCallback = (stageScene: RTScenePosition) => void
