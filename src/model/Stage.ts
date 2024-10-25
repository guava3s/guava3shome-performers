import {PerformerDescription} from "./Performer";
import {CHARTS_BASE_COLOR, ERROR_PREFIX} from "../common/enums";
import {BlurScene, generateBlurScene, StageScene} from "./Scene";
import {StageOperation} from "../index";
import {MetaConfig} from "./Config";
import {IRTActionFrameDesc} from "../runtime";
import {deepClone, isNotObject, isObject} from "../common/utils";
import {useRenderEngine} from "../core";
import {ActionFrameList} from "./frame";
import {incId} from "../common/trigger";

export type StageContext = G3Stage

const GLOBAL_STAGE_MAP: Record<string, G3Stage> = {}

export class G3Stage implements StageOperation {

    readonly globalProperties: MetaConfig = {
        animation: {
            duration: 1000,
        },
        tooltip: {
            xDistance: 30,
            yDistance: 40,
        },
        width: 0,
        height: 0,
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
        },
        approachEndAppearance: 1,
        useForceAutoRefresh: false,
        useSceneTransition: false
    }

    readonly _ctx: CanvasRenderingContext2D
    private readonly _id: string = incId()
    private readonly _scenes: StageScene[] = []
    private readonly _actionFrames: ActionFrameList = {}

    constructor(private readonly _canvasDom: HTMLCanvasElement, _startParam?: MetaConfig | undefined) {
        this._ctx = _canvasDom.getContext('2d')
        this.globalProperties.width = _canvasDom.width
        this.globalProperties.height = _canvasDom.height
        G3Stage._initStageStartParams(this.globalProperties, _startParam)
        this._initRenderEngine()
        GLOBAL_STAGE_MAP[this._id] = this
    }

    /**
     * 初始化启动参数
     * @param originConfig 本地配置
     * @param config 新增配置
     * @private
     */
    private static _initStageStartParams(originConfig: MetaConfig, config?: MetaConfig): void {
        if (!config)
            return
        const recursionAssign = (source, target): void => {
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
        recursionAssign(originConfig, config)
    }

    private _initRenderEngine(): void {
        const _this = this
        // const renderEngine = useRenderEngine(this, this._scenes);
        // Object.defineProperties(this._renderContainer, {
        //     'runEngine': {
        //         set(value) {
        //             value && _this._startEngine()
        // TODO 判定是否确实需要重新渲染
        // }
        // },
        // 'sceneStack': {
        //     set(value) {
        // TODO 生成RTStatistic信息
        // }
        // }
        // })
    }

    private _startEngine(): void {
        // const {sceneStack} = this._renderContainer
        // const lastRenderOption = deepClone(sceneStack[sceneStack.length - 1])
        // const {width, height} = this.globalProperties
        // this._clearFrameAndRect(0, 0, width, height)
        // this._RENDER_MODEL_SWITCH[lastRenderOption.model](lastRenderOption.groups, this)
        // this._renderContainer.runEngine = false
    }

    _addActionFrame(description: PerformerDescription, frame: number): void {
        const type = description.type + '_' + description.id
        if (!this._actionFrames[type]) {
            this._actionFrames[type] = []
        }
        this._actionFrames[type].push(frame)
    }

    _getActionFrames(typeAndId: string): number[] {
        return Object.keys(this._actionFrames).filter(key => key.startsWith(typeAndId)).map(item => this._actionFrames[item]).flat()
    }

    _clearFrameAndRect(x: number, y: number, w: number, h: number, typeDesc?: IRTActionFrameDesc): void {
        let actionFrames: Array<number> = []
        if (typeDesc) {
            const {type, id = ''} = typeDesc
            const typeAndId = `${type}_${id}`
            actionFrames = this._getActionFrames(typeAndId)
            actionFrames && actionFrames.forEach(item => cancelAnimationFrame(item))
        }
        this._ctx.clearRect(x, y, w, h)
    }

    /*********************************************active********************************************/

    pushScene(scene: StageScene, run?: boolean): string {
        this._ctx.save()
        this._scenes.push(scene)
        scene.setStage(this)
        return scene.id
        // TODO 控制渲染
    }

    popScene(run?: boolean): Required<BlurScene> {
        const pop = this._scenes.pop()
        if (pop) {
            // TODO 控制渲染
            return generateBlurScene(pop)
        }
    }

    hasScene(id: string): boolean {
        return !!this._scenes.find(item => item.id === id)
    }

    addEvent(eventName: string, callback: EventListener | EventListenerObject): void {
        this._canvasDom.addEventListener(eventName, callback)
    }

    removeEvent(eventName: string, callback: EventListener | EventListenerObject): void {
        this._canvasDom.removeEventListener(eventName, callback)
    }

    private refresh(run?: boolean): void {
    }
}
