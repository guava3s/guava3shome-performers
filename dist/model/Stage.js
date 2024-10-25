"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.G3Stage = void 0;
const enums_1 = require("../common/enums");
const Scene_1 = require("./Scene");
const utils_1 = require("../common/utils");
const trigger_1 = require("../common/trigger");
const GLOBAL_STAGE_MAP = {};
class G3Stage {
    constructor(_canvasDom, _startParam) {
        this._canvasDom = _canvasDom;
        this.globalProperties = {
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
                activeColor: enums_1.CHARTS_BASE_COLOR.activeColor,
                protrudeColor: enums_1.CHARTS_BASE_COLOR.protrudeColor,
                tooltipColor: enums_1.CHARTS_BASE_COLOR.tooltipColor,
                hoverColor: enums_1.CHARTS_BASE_COLOR.hoverColor,
                weakColor: enums_1.CHARTS_BASE_COLOR.weakColor,
                normalColor: enums_1.CHARTS_BASE_COLOR.normalColor,
                fillNormalColor: enums_1.CHARTS_BASE_COLOR.fillNormalColor,
            },
            approachEndAppearance: 1,
            useForceAutoRefresh: false,
            useSceneTransition: false
        };
        this._id = (0, trigger_1.incId)();
        this._scenes = [];
        this._actionFrames = {};
        this._ctx = _canvasDom.getContext('2d');
        this.globalProperties.width = _canvasDom.width;
        this.globalProperties.height = _canvasDom.height;
        G3Stage._initStageStartParams(this.globalProperties, _startParam);
        this._initRenderEngine();
        GLOBAL_STAGE_MAP[this._id] = this;
    }
    /**
     * 初始化启动参数
     * @param originConfig 本地配置
     * @param config 新增配置
     * @private
     */
    static _initStageStartParams(originConfig, config) {
        if (!config)
            return;
        const recursionAssign = (source, target) => {
            for (const [key, value] of Object.entries(target)) {
                if (typeof source[key] === typeof void 0) {
                    throw new Error(`${enums_1.ERROR_PREFIX}'${key}' is not a field specified in the startup parameter table.`);
                }
                const objList = [value, source[key]];
                if (objList.every(utils_1.isObject)) {
                    recursionAssign(source[key], value);
                }
                else if (objList.every(utils_1.isNotObject)) {
                    source[key] = value;
                }
            }
        };
        recursionAssign(originConfig, config);
    }
    _initRenderEngine() {
        const _this = this;
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
    _startEngine() {
        // const {sceneStack} = this._renderContainer
        // const lastRenderOption = deepClone(sceneStack[sceneStack.length - 1])
        // const {width, height} = this.globalProperties
        // this._clearFrameAndRect(0, 0, width, height)
        // this._RENDER_MODEL_SWITCH[lastRenderOption.model](lastRenderOption.groups, this)
        // this._renderContainer.runEngine = false
    }
    _addActionFrame(description, frame) {
        const type = description.type + '_' + description.id;
        if (!this._actionFrames[type]) {
            this._actionFrames[type] = [];
        }
        this._actionFrames[type].push(frame);
    }
    _getActionFrames(typeAndId) {
        return Object.keys(this._actionFrames).filter(key => key.startsWith(typeAndId)).map(item => this._actionFrames[item]).flat();
    }
    _clearFrameAndRect(x, y, w, h, typeDesc) {
        let actionFrames = [];
        if (typeDesc) {
            const { type, id = '' } = typeDesc;
            const typeAndId = `${type}_${id}`;
            actionFrames = this._getActionFrames(typeAndId);
            actionFrames && actionFrames.forEach(item => cancelAnimationFrame(item));
        }
        this._ctx.clearRect(x, y, w, h);
    }
    /*********************************************active********************************************/
    pushScene(scene, run) {
        this._ctx.save();
        this._scenes.push(scene);
        scene.setStage(this);
        return scene.id;
        // TODO 控制渲染
    }
    popScene(run) {
        const pop = this._scenes.pop();
        if (pop) {
            // TODO 控制渲染
            return (0, Scene_1.generateBlurScene)(pop);
        }
    }
    hasScene(id) {
        return !!this._scenes.find(item => item.id === id);
    }
    addEvent(eventName, callback) {
        this._canvasDom.addEventListener(eventName, callback);
    }
    removeEvent(eventName, callback) {
        this._canvasDom.removeEventListener(eventName, callback);
    }
    refresh(run) {
    }
}
exports.G3Stage = G3Stage;
