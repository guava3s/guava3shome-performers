import {MetaConfig} from "./types/Config";
import {CHARTS_BASE_COLOR, ERROR_PREFIX, STAGE_RENDER_MODEL} from "./common/enums";
import {deepClone, isNotObject, isObject} from "./common/utils";
import {PerformerDescription} from "./types/Performer";
import {StageActionFrame, StageRenderContainer, StageScene} from "./types/Stage";
import {RTActionFrameDesc, RTScenePosition, RTSceneUpdateCallback} from "./types/Runtime";

export default class G3Stage {

    private readonly _ctx: CanvasRenderingContext2D
    private readonly _actionFrames: StageActionFrame = {}
    private readonly _renderContainer: StageRenderContainer = {
        runEngine: false,
        trigger: 0,
        sceneStack: []
    }
    private readonly _diagramStartParam: MetaConfig = {
        animation: {
            duration: 1000,
        },
        tooltip: {
            xDistance: 30,
            yDistance: 40,
        },
        width: 300,
        height: 300,
        drawParams: {
            lineWidth: 2
        },
        colors: {
            activeColor: CHARTS_BASE_COLOR.activeColor,
            protrudeColor: CHARTS_BASE_COLOR.protrudeColor,
            tooltipColor: CHARTS_BASE_COLOR.tooltipColor,
            hoverColor: CHARTS_BASE_COLOR.hoverColor,
            weakColor: CHARTS_BASE_COLOR.weakColor,
            normalColor: CHARTS_BASE_COLOR.normalColor,
            fillNormalColor: CHARTS_BASE_COLOR.fillNormalColor,
        }
    }

    constructor(private readonly _canvasDom: HTMLCanvasElement, private readonly _startParam?: MetaConfig | undefined) {
        this._ctx = _canvasDom.getContext('2d')
        _startParam && this._initStageStartParams(_startParam)
    }

    /**
     * 初始化启动参数
     * @param config
     * @private
     */
    private _initStageStartParams(config: MetaConfig): void {

        const recursionAssign = (source, target) => {
            for (const [key, value] of Object.entries(target)) {
                if (typeof source[key] === typeof void 0) {
                    throw new Error(`${ERROR_PREFIX}'${key}' is not a field specified in the startup parameter table.`)
                }
                const objList = [value, source[key]]
                if (objList.every(isObject)) {
                    recursionAssign(source[key], value)
                } else if (objList.every(isNotObject)) {
                    source[key] = value
                }
            }
        }
        recursionAssign(this._diagramStartParam, config)
    }

    addActionFrame(description: PerformerDescription, frame: number): void {
        const type = description.type + '_' + description.id
        if (!this._actionFrames[type]) {
            this._actionFrames[type] = []
        }
        this._actionFrames[type].push(frame)
    }

    getActionFrames(typeAndId: string): Array<number> {
        return Object.keys(this._actionFrames).filter(key => key.startsWith(typeAndId)).map(item => this._actionFrames[item]).flat()
    }

    clearFrameAndRect(x: number, y: number, w: number, h: number, typeDesc?: RTActionFrameDesc): void {
        let actionFrames: Array<number> = []
        if (typeDesc) {
            const {type, id = ''} = typeDesc
            const typeAndId = `${type}_${id}`
            actionFrames = this.getActionFrames(typeAndId)
            actionFrames && actionFrames.forEach(item => cancelAnimationFrame(item))
        }
        this._ctx.clearRect(x, y, w, h)
    }

    pushScene({renderGroup, renderModel}: StageScene, run: boolean): void {
        this._ctx.save()
        this._renderContainer.sceneStack.push({renderGroup, renderModel})
        this._renderContainer.runEngine = run
    }

    popScene(index: number, run: boolean): Array<StageScene | undefined> {
        index = Math.min(index, this._renderContainer.sceneStack.length - 1)
        const stageStack: Array<StageScene | undefined> = []
        for (let i = 0; i < index; i++) {
            this._ctx.restore()
            stageStack.push(this._renderContainer.sceneStack.pop())
        }
        this._renderContainer.runEngine = run
        return stageStack
    }

    getNewestScene(): RTScenePosition {
        const sceneStack: Array<StageScene> = this._renderContainer.sceneStack;
        return {
            scene: sceneStack[sceneStack.length - 1],
            index: sceneStack.length - 1
        }
    }

    updateScene(scene: StageScene, index: number, run: boolean = true): void {
        if (scene && index >= 0) {
            this._renderContainer.sceneStack[index] = scene
            this._renderContainer.runEngine = run
        }
    }

    updateNewestScene(callback: RTSceneUpdateCallback, run: boolean = true): void {
        callback(this.getNewestScene())
        this._renderContainer.runEngine = run
    }

    addEvent(eventName: string, callback: EventListener | EventListenerObject): void {
        this._canvasDom.addEventListener(eventName, callback)
    }

    removeEvent(eventName: string, callback: EventListener | EventListenerObject): void {
        this._canvasDom.removeEventListener(eventName, callback)
    }

    getStartParams(): MetaConfig {
        return this._diagramStartParam
    }
}
