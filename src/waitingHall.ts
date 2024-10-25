import {PERFORMER_TYPE, STAGE_RENDER_MODEL} from "./common/enums";
import {IRTEngineCallPerformer} from "./runtime";
import {BlurGroup, BlurGroupMember} from "./model/Group";
import {StageContext} from "./model/Stage";

// 返回该组的渲染形式函数
export function callPerformerRender(model: STAGE_RENDER_MODEL | undefined, members: Array<BlurGroupMember>): IRTEngineCallPerformer {
    const performerTypes = members.map(item => item.description.type)
    const type: PERFORMER_TYPE | undefined = performerTypes.pop()
    if (performerTypes.every(item => item === type)) {
        const render = renderDict[`${model}_${type}`]
        if (render) {
            return render
        }
        throw new Error(`The render Dictionary does not exist ${model}_ ${type} function`)
    }
    // TODO 提供报错信息
}


const renderDict = {
    PARALLEL_RECT: renderParallelRect,
    PARALLEL_LINE: renderParallelLine,
    PRIORITY_LINE: renderPriorityLine,
}

async function renderParallelRect(group: BlurGroup, stage: StageContext, afterCall?: (value: unknown) => void): Promise<void> {

}

async function renderParallelLine(group: BlurGroup, stage: StageContext, afterCall?: (value: unknown) => void): Promise<void> {

}

async function renderPriorityRect(group: BlurGroup, stage: StageContext, afterCall?: (value: unknown) => void): Promise<void> {

}

async function renderPriorityLine({
                                      members,
                                      duration,
                                      ...other
                                  }: BlurGroup, stage: StageContext, afterCall?: (value: unknown) => void): Promise<void> {
    for (const index in members) {
        const member: BlurGroupMember = members[index]
        if (member.duration > 0) {
            await linePerformAnimation(stage, member, afterCall)
        } else {
            await linePerform(stage, member, afterCall)
        }
    }
}

function linePerform(stage: StageContext, {
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
    item.afterRender && item.afterRender(description)
    afterCallback && afterCallback()
}

function linePerformAnimation(stage: StageContext, member: BlurGroupMember, afterCallback?: (value?: unknown) => void): void {
    const {description, ...item} = member
    const {startCoordinate, endCoordinate, lineInfo} = description
    const {drawParams, animation} = stage.getStartParams()
    const runDuration = item.duration

    let startTime = 0
    let prevX = startCoordinate.x
    let prevY = startCoordinate.y
    let nextX
    let nextY

    stage._ctx.lineWidth = lineInfo.width || drawParams.lineWidth

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
        linePerform(stage, member)

        prevX = nextX
        prevY = nextY

        if (progress < 1) {
            stage._addActionFrame(description, requestAnimationFrame(step))
        } else {
            afterCallback && afterCallback(description)
        }
    })
    stage._addActionFrame(description, frame)
}

