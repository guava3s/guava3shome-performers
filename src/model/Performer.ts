import {MetaCoordinate} from "./Coordinate";
import {PERFORMER_TYPE} from "../common/enums";
import {StageContext} from "./Stage";
import {incId} from "../common/trigger";
import {BlurGroupMember} from "./Group";

export interface PerformerDescription {
    readonly type: PERFORMER_TYPE
    id?: string
    startCoordinate: MetaCoordinate
    endCoordinate?: MetaCoordinate
    label?: string
    active?: boolean
    angle?: number
    scale?: number
    length?: number
    width?: number
    lineWidth?: number
    color?: string | Array<string> | Array<[number, string]>
    followerLineColor?: string
}

export type PerformerForActionFrame = Pick<PerformerDescription, 'type' | 'id'>

export abstract class PerformerDescriptionInstance {

    readonly type: PERFORMER_TYPE
    readonly id?: string = incId()
    active?: boolean
    angle?: number
    scale?: number


    protected constructor(public type: PERFORMER_TYPE) {
        this.fillPerformer()
    }

    static generator<T extends PerformerDescriptionInstance>(this: new (...args: any[]) => T,
                                                             ...args: ConstructorParameters<typeof PerformerDescriptionInstance>): T {
        return new this(...args);
    }

    protected abstract fillPerformer(): void;

    abstract perform(stage: StageContext, item: BlurGroupMember, afterCallback?: () => void): void;

    abstract performForAnimation(stage: StageContext, item: BlurGroupMember, afterCallback?: () => void): void;
}

export interface Performer {
    startCoordinate: MetaCoordinate
    id?: string
    active?: boolean
    angle?: number
    scale?: number
    color?: string | Array<string> | Array<[number, string]>
}

export interface LinePerformer extends Performer {
    type: PERFORMER_TYPE
    endCoordinate: MetaCoordinate
    length: number
    width?: number
    color?: string
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
    entity: any
}

export interface PerformerTypeShapeInfo {
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
