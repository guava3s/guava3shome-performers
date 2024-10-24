import {STAGE_RENDER_MODEL} from "../common/enums";
import {StageScene} from "./Stage";
import genIncId, {genName} from "../common/trigger";
import {IRTRequiredId} from "../runtime";

export function fillScene(scene: StageScene): IRTRequiredId<StageScene> {
    !scene.id && (scene.id = genIncId())
    !scene.model && (scene.model = STAGE_RENDER_MODEL.PARALLEL)
    return scene as IRTRequiredId<StageScene>
}
