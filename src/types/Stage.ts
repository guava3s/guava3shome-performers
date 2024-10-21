import {PerformerDescription} from "./Performer";
import {MetaConfig} from "./Config";
import {STAGE_RENDER_MODEL, STAGE_RENDER_GUIDE} from "../common/enums";

export interface StageRenderContainer {
    runEngine: boolean
    trigger: number
    sceneStack: Array<StageSceneStack>
}

export interface StageSceneStack {
    contextState: object
    renderModel: STAGE_RENDER_MODEL
    renderGroup: Array<StageGroup>
}

export interface StageGroup {
    members: Array<StageGroupMember>
    priority: number
    beforeRender?: (description: PerformerDescription) => void
    type: STAGE_RENDER_GUIDE
    duration: number
}

export interface StageGroupMember {
    readonly id: string
    description: PerformerDescription
    priority: number
    beforeRender?: (description: PerformerDescription) => void
}

export interface StageActionFrame {
    [key: string]: Array<number>
}

export default class G3Stage {

    public readonly renderContainer: StageRenderContainer
    private readonly _ctx: CanvasRenderingContext2D
    private readonly _canvasDom: HTMLCanvasElement
    private readonly _actionFrames: StageActionFrame

    constructor(private readonly diagramStartParam: MetaConfig) {
    }

}
