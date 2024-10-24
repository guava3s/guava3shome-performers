import {PerformerDescription, PerformerDescriptionInstance} from "./Performer";
import {STAGE_RENDER_MODEL} from "../common/enums";
import {deepClone, generateUUID} from "../common/utils";
import {ORTStatistic} from "../runtime";

export interface StageRenderContainer {
    runEngine: boolean
    sceneStack: Array<StageScene>
}

export interface StageScene {
    name: string
    groups: Array<StageGroup>
    id?: string
    contextState?: object
    model?: STAGE_RENDER_MODEL
}

export interface StageGroup {
    name: string
    members: Array<StageGroupMember>
    id?: string
    model?: STAGE_RENDER_MODEL
    priority?: number
    duration?: number,
    beforeRender?: (description: PerformerDescription) => void
    afterRender?: (description: PerformerDescription) => void
}



export interface StageGroupMember {
    description: PerformerDescription
    priority?: number
    duration?: number,
    beforeRender?: (description: PerformerDescription) => void
    afterRender?: (description: PerformerDescription) => void
}

/**
 * 操作帧管理
 */
export interface StageActionFrame {
    [key: string]: Array<number>
}
