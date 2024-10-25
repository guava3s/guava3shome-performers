import {deepClone, emptyFunc} from "../common/utils";
import {STAGE_RENDER_MODEL} from "../common/enums";
import {incId} from "../common/trigger";
import {PerformerDescription} from "./Performer";

export interface BlurGroup extends GroupRenderParams {
    name: string
    members: Array<BlurGroupMember>
    id?: string
    mode?: STAGE_RENDER_MODEL
}

export interface BlurGroupMember extends GroupRenderParams {
    description: PerformerDescription
}

interface GroupRenderParams {
    priority?: number
    duration?: number,
    beforeRender?: (description: PerformerDescription) => void
    afterRender?: (description: PerformerDescription) => void
}


export function fillGroup(group: BlurGroup[]): Required<BlurGroup>[] {
    let groupStartIndex = calcPriorityMinIndex(group)
    return group.map(({members: oldMembers, ...other}: BlurGroup, index: number) => {

        let memberStartIndex = calcPriorityMinIndex(oldMembers)
        const members = oldMembers.map(({description, ...other}) => {
            return Object.assign({
                duration: 0,
                priority: memberStartIndex++,
                beforeRender: emptyFunc,
                afterRender: emptyFunc,
                description: deepClone(description)
            }, other) as Required<BlurGroupMember>
        })

        return Object.assign({
            id: incId(),
            mode: STAGE_RENDER_MODEL.PARALLEL,
            duration: 0,
            priority: groupStartIndex++,
            beforeRender: emptyFunc,
            afterRender: emptyFunc,
            members
        }, other)
    })
}

function calcPriorityMinIndex(entity: GroupRenderParams[]): number {
    const map = entity.filter(obj => !isNaN(obj.priority + 1)).map(item => item.priority) as number[]
    return Math.min(...map) - (entity.length - map.length)
}


