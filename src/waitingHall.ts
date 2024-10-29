import {PERFORMER_TYPE, STAGE_RENDER_MODEL} from "./common/enums";
import {IRTEngineCallPerformer} from "./runtime";
import {BlurGroup, BlurGroupMember, BlurGroupWithPerformers} from "./model/Group";
import {StageContext} from "./model/Stage";

// 返回该组的渲染形式函数
export function callPerformerRender(model: STAGE_RENDER_MODEL, members: Array<BlurGroupMember>): IRTEngineCallPerformer {
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
                                      performers,
                                      duration,
                                      ...other
                                  }: BlurGroupWithPerformers, stage: StageContext, afterCall?: (value?: unknown) => void): Promise<void> {
    for (const index in members) {
        const member: BlurGroupMember = members[index]
        if (member.duration > 0) {
            // await linePerformAnimation(stage, member, afterCall)
            await performers[member.description.id].performForAnimation(stage, member, afterCall)
        } else {
            await performers[member.description.id].perform(stage, member, afterCall)
        }
    }
}
