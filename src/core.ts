import {callPerformerRender} from "./waitingHall";
import {StageContext} from "./model/Stage";
import {STAGE_RENDER_MODEL} from "./common/enums";
import {BlurGroup} from "./model/Group";

export interface RenderOptionDetail {
    [key: string]: (groups: Array<BlurGroup>) => Promise<void>
}

export function useRenderEngine(stage: StageContext): RenderOptionDetail {

    return {
        [STAGE_RENDER_MODEL.PRIORITY]: async function (groups: Array<BlurGroup>): Promise<void> {
            groups.sort((a, b) => a.priority - b.priority)
            groups.forEach(({members}) => members.sort((a, b) => a.priority - b.priority))

            for (const group of groups) {
                const {model, ...other} = group
                const render = callPerformerRender(model, other.members)
                // 组内渲染
                await new Promise((resolve) => render?.(group, stage, resolve))
            }
        },
        [STAGE_RENDER_MODEL.PARALLEL]: async function (groups: Array<BlurGroup>): Promise<void> {
            Promise.all(groups.map((item) => {
                const {model, ...other} = item
                const render = callPerformerRender(model, other.members)
                return new Promise((resolve) => {
                    render?.(item, stage).finally(() => resolve())
                })
            }))
        }
    }
}
