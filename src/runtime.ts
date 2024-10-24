import {StageGroup, StageScene} from "./model/Stage";
import {StageContext} from "./core";

export interface IRTActionFrameDesc {
    id: string
    type: string
}

export interface ORTScenePosition {
    index: number
    scene: StageScene
}

export interface ORTStatistic {
    scene: number
    group: number
    currentScene?: string
    currentGroup?: number
}

export interface ORTGroupInteraction {
    id: string
    scene: number
    count: number
}

export type ORTSceneInteraction = Omit<ORTGroupInteraction, 'scene'>

export type IRTSceneUpdateCallback = (stageScene: ORTScenePosition) => void
export type IRTEngineCallPerformer = (group: StageGroup, stage: StageContext, afterCall?: (value: unknown) => void) => Promise<void>
export type IRTRequiredId<T> = Required<Pick<T, 'id'>> & Omit<T, 'id'>
export type IRTSceneAndGroup = 'scene' | 'group'
