import {RequiredId} from "./runtime";
import {BlurScene, StageScene} from "./model/Scene";
import {BlurGroup, BlurGroupWithPerformers} from "./model/Group";

export interface SceneOperation {
    addGroups: (groups: BlurGroup[], run?: boolean) => void
    removeGroups: (ids: string[], run?: boolean) => void
    updateGroups: (groups: BlurGroup[], run?: boolean) => void
    getGroups: () => Required<BlurGroupWithPerformers>[]
}

export interface StageOperation {
    runRender: (run: boolean) => void
    pushScene: (scene: RequiredId<StageScene>, run?: boolean) => string
    popScene: (run?: boolean) => Required<BlurScene> | undefined
    hasScene: (name: string) => boolean
    addEvent: (eventName: string, callback: EventListener | EventListenerObject) => void
    removeEvent: (eventName: string, callback: EventListener | EventListenerObject) => void
}
