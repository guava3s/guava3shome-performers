import {PerformerDescription} from "./Performer";
import {STAGE_GROUP_GUIDE, STAGE_RENDER_MODEL} from "../common/enums";

export interface StageRenderContainer {
    runEngine: boolean
    trigger: number
    sceneStack: Array<StageScene>
}

export interface StageScene {
    contextState?: object
    renderModel: STAGE_RENDER_MODEL
    renderGroup: Array<StageGroup>
}

export interface StageGroup {
    members: Array<StageGroupMember>
    priority: number
    beforeRender?: (description: PerformerDescription) => void
    type: STAGE_GROUP_GUIDE
    duration: number
}

export interface StageGroupMember {
    readonly id: string
    description: PerformerDescription
    priority: number
    beforeRender?: (description: PerformerDescription) => void
}

/**
 * 操作帧管理
 */
export interface StageActionFrame {
    [key: string]: Array<number>
}
