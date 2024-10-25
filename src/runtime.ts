import {StageContext,} from "./model/Stage";
import {BlurGroup} from "./model/Group";

export interface IRTActionFrameDesc {
    id: string
    type: string
}

// id为必选类型
export type RequiredId<T> = Required<Pick<T, 'id'>> & Omit<T, 'id'>
export type IRTEngineCallPerformer = (group: BlurGroup, stage: StageContext, afterCall?: (value: unknown) => void) => Promise<void>
export type IRTSceneAndGroup = 'scene' | 'group'
