import {deepClone} from "../common/utils";
import {STAGE_RENDER_MODEL} from "../common/enums";
import {StageGroup} from "./Stage";
import genIncId, {genName} from "../common/trigger";
import {IRTRequiredId} from "../runtime";

export function fillGroup(group: StageGroup): IRTRequiredId<StageGroup> {
    group = deepClone(group)
    !group.id && (group.id = genIncId())
    !group.model && (group.model = STAGE_RENDER_MODEL.PARALLEL)
    isNaN(group.priority + 1) && (group.priority = +group.id)
    isNaN(group.duration + 1) && (group.duration = 0)
    return group as IRTRequiredId<StageGroup>
}

