import {PerformerDescription} from "./types/Performer";
import {RTActionFrameDesc, RTScenePosition, RTSceneUpdateCallback} from "./types/Runtime";
import {StageGroup, StageScene, StageStatistic} from "./types/Stage";

export interface G3Index {
    addActionFrame: (description: PerformerDescription, frame: number) => void
    getActionFrames: (typeAndId: string) => Array<number>
    clearFrameAndRect: (x: number, y: number, w: number, h: number, typeDesc?: RTActionFrameDesc) => void
    pushScene: (scene: StageScene, run: boolean = true, transitionTime: number = 0) => StageStatistic
    popScene: (index: number, run: boolean) => Array<StageScene | undefined>
    pushSimpleScene: (group: StageGroup, run: boolean = true) => void
    addGroup: (group: StageGroup, sceneIndex: number) => StageStatistic
    removeGroup: (sceneId: string, groupId: string) => StageStatistic
    getNewestScene: () => RTScenePosition
    updateScene: (scene: StageScene, index: number, run: boolean = true) => void
    updateNewestScene: (callback: RTSceneUpdateCallback, run: boolean = true) => void
    addEvent: (eventName: string, callback: EventListener | EventListenerObject) => void
    removeEvent: (eventName: string, callback: EventListener | EventListenerObject) => void
}
