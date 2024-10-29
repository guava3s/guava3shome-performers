import {MetaCoordinate} from "../model/Coordinate";
import {PerformerDescriptionInstance} from "../model/Performer";
import {PERFORMER_TYPE} from "../common/enums";
import {BlurGroupMember} from "../model/Group";
import {G3Stage, StageContext} from "../model/Stage";
import {MetaConfig, MetaConfigDrawParams} from "../model/Config";
import {DeepRequired} from "../common/meta";


export interface BlurPrLine {
    startCoordinate: MetaCoordinate
    endCoordinate: MetaCoordinate
    id?: string
    lineWidth?: number
    color?: string
}

export class PrLine extends PerformerDescriptionInstance {

    constructor(public params: BlurPrLine) {
        super(PERFORMER_TYPE.LINE)
    }

    perform(stage: G3Stage, {
        description,
        ...item
    }: BlurGroupMember, afterCallback?: (value?: unknown) => void): void {
        item.beforeRender && (item.beforeRender(description))
        const {startCoordinate, endCoordinate} = this
        const drawParams: Required<MetaConfigDrawParams> = stage.globalProperties.drawParams as Required<MetaConfigDrawParams>
        stage._ctx.strokeStyle = this.params.color || drawParams.colors.defaultColor as string
        // HACK
        stage._ctx.beginPath()
        stage._ctx.moveTo(startCoordinate.x, startCoordinate.y)
        stage._ctx.lineTo(endCoordinate.x, endCoordinate.y)
        stage._ctx.closePath()
        stage._ctx.lineWidth = this.params.lineWidth || drawParams.lineWidth
        stage._ctx.stroke()
        item.afterRender && item.afterRender(description)
        afterCallback && afterCallback()
    }


    performForAnimation(stage: StageContext, member: BlurGroupMember, afterCallback?: (value?: unknown) => void): void {
        const {description, ...item} = member
        const {startCoordinate, endCoordinate, lineInfo} = this
        const {drawParams, animation} = stage.globalProperties.drawParams
        const runDuration = item.duration

        let startTime = 0
        let prevX = startCoordinate.x
        let prevY = startCoordinate.y
        let nextX
        let nextY

        stage._ctx.lineWidth = lineInfo.width || drawParams.lineWidth

        const _this = this
        const frame = requestAnimationFrame(function step(currentTime) {
            !startTime && (startTime = currentTime)
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / runDuration, 1)

            nextX = startCoordinate.x + (endCoordinate.x - startCoordinate.x) * progress
            nextY = startCoordinate.y + (endCoordinate.y - startCoordinate.y) * progress

            description.startCoordinate = {
                x: prevX,
                y: prevY
            }
            description.endCoordinate = {
                x: nextX,
                y: nextY
            }
            _this.perform(stage, member)

            prevX = nextX
            prevY = nextY

            if (progress < 1) {
                stage._addActionFrame({id: description.id, type: description.type}, requestAnimationFrame(step))
            } else {
                afterCallback && afterCallback(description)
            }
        })
        stage._addActionFrame(description, frame)
    }


    protected fillPerformer(): void {
    }

}
