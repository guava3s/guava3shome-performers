import {PERFORMER_TYPE_MAP, STAGE_RENDER_MODEL} from "../common/enums";
import {StageContext} from "./Stage";
import {incId} from "../common/trigger";
import {SceneOperation} from "../index";
import {PerformerDescriptionInstance} from "./Performer";
import {fillGroup, BlurGroup, BlurGroupWithPerformers, PerformerMap} from "./Group";
import {deepClone} from "../common/utils";

export interface BlurScene {
    name: string
    groups: Array<BlurGroup>
    mode?: STAGE_RENDER_MODEL
    id?: string
}

export class StageScene implements SceneOperation {

    readonly id = incId()
    private _stage: StageContext | null
    /**
     * name-[id,entity]
     * @private
     */
    private readonly _groups: Map<string, [string, Required<BlurGroup>]> = new Map<string, [string, Required<BlurGroup>]>()
    /**
     * id-performer
     * @private
     */
    private readonly _performers: Map<string, PerformerDescriptionInstance> = new Map<string, PerformerDescriptionInstance>();

    constructor(public name: string, public mode?: STAGE_RENDER_MODEL) {
        !this.mode && (this.mode = STAGE_RENDER_MODEL.PARALLEL)
    }

    addGroups(groups: BlurGroup[], run?: boolean): void {
        for (const group: Required<BlurGroup> of fillGroup(groups)) {
            if (this._groups.has(group.name)) {
                this.updateGroups([group], run)
            } else {
                this._registerPerformer(group)
                this._groups.set(group.name, [group.id, group])
            }
        }
        !this._stage?.hasScene(this.id as string) && this._stage?.pushScene(this, run)
    }

    getGroups(): Required<BlurGroupWithPerformers>[] {
        return Array.from(this._groups.values()).map(([_, {members, ...other}]) => {
            return {
                performers: deepClone(members.reduce((result: PerformerMap, {description}) => {
                    return (result[description.id] = this._performers.get(description.id as string) as PerformerDescriptionInstance, result)
                }, {})),
                members: deepClone(members),
                ...other
            }
        })
    }

    removeGroups(names: string[], run?: boolean): void {
        if (names) {
            names.forEach(name => {
                const group = this._groups.get(name)
                if (group?.length) {
                    group[1].members.forEach(member => this._removePerformer(member.description.id as string))
                }
                this._groups.delete(name)
            })
            return
        }
        this._clear()
    }

    /**
     * 将本次提供的属性值赋予给已有的对应属性，未提供的则不做更改；members字段则直接替换
     * @param groups
     * @param run
     */
    updateGroups(groups: BlurGroup[], run?: boolean): void {
        groups.forEach(group => {
            const [_, oldGroup]: [string, Required<BlurGroup>] = this._groups[group.name]
            oldGroup.members.forEach(member => {
                this._removePerformer(member.description.id as string)
            })
            group.members = deepClone(group.members)
            Object.assign(oldGroup, group)
            this._registerPerformer(group)
        })
    }

    setStage(stage: StageContext): void {
        this._stage = stage
    }

    private _clear(): void {
        this._groups.clear()
        this._performers.clear()
        this._stage = null
    }

    private _registerPerformer(group: BlurGroup): void {
        group.members.forEach(({description}) => {
            if (!description.id || !this._performers.has(description.id)) {
                const performer: PerformerDescriptionInstance = PERFORMER_TYPE_MAP[description.type].generator(...description)
                description.id = performer.id
                this._performers.set((performer.id as string), performer)
            }
        })
    }

    private _removePerformer(performerId: string): void {
        performerId && this._performers.delete(performerId)
    }

}

export function generateBlurScene(scene: StageScene): Required<BlurScene> {
    return {
        name: scene.name,
        groups: scene.getGroups(),
        mode: scene.mode,
        id: scene.id
    } as Required<BlurScene>
}
