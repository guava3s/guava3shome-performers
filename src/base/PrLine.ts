import {MetaCoordinate} from "../model/Coordinate";
import {PerformerDescriptionInstance} from "../model/Performer";
import {CHARTS_BASE_COLOR, PERFORMER_TYPE} from "../common/enums";
import {BlurGroupMember} from "../model/Group";
import {StageContext} from "../model/Stage";

export interface BlurPrLine {

    id?: string
}

export class PrLine extends PerformerDescriptionInstance {


    color: string = CHARTS_BASE_COLOR.reBackgroundColor
    width: number = 1

    constructor(public startCoordinate: MetaCoordinate,
                public endCoordinate: MetaCoordinate,
                public readonly id?: string) {
        super(PERFORMER_TYPE.LINE)
    }

    protected perform(stage: StageContext, {
        description,
        ...item
    }: BlurGroupMember, afterCallback?: (value?: unknown) => void): void {
        item.beforeRender && (item.beforeRender(description))
        const {startCoordinate, endCoordinate, width} = this
        stage._ctx.strokeStyle = this.color
        stage._ctx.beginPath()
        stage._ctx.moveTo(startCoordinate.x, startCoordinate.y)
        stage._ctx.lineTo(endCoordinate.x, endCoordinate.y)
        stage._ctx.closePath()
        stage._ctx.lineWidth = width
        stage._ctx.stroke()
        afterCallback && afterCallback()
    }

    protected fillPerformer(): void {

    }

}
