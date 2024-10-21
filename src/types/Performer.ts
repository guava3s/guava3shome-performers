import {MetaCoordinate} from "./Meta";
import {PERFORMER_TYPE} from "../common/enums";

export interface PerformerDescription {
    id: string
    type: PERFORMER_TYPE
    startCoordinate: MetaCoordinate
    endCoordinate?: MetaCoordinate
    active?: boolean
    angle?: number
    scale?: number
}

export interface PerformerTypeLineInfo {
    width: number
    color: string
}

export interface PerformerTypePointInfo {
    entanglementColor: string
    entanglementLineWidth: number
}

export interface PerformerTypeFontInfo {
    color: string
    label: string
}

export interface PerformerTypeImageInfo {
    width: number
    height: number
    entity: any
}

export interface PerformerTypeShapeInfo {
    width: number
    height: number
    /*
        节点填充色,长度大于1，则使用渐变,
        string: '1e2254' / 'red'
        array:  ['#1e2254','#3e2554']
        tuple:  [[0.5, '#1e2254'],[1, '#3e2554']]
     */
    color: string | Array<string> | Array<[number, string]>
    label: string
    followerLineColor?: string
}
