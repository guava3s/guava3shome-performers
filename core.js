import {ERROR_PREFIX} from "./enum";
import {isNotObject, isObject} from "./common/util";

/*
    performer:  一个区域内的一个绘制项
    group:   一帧内的某个拥有相同性质绘制项组，1 group = n performer
    scene:  即一帧绘制， 1 scene = n group
    stage:  绘制环境， 1 stage = n scene, 且一段时间内只会显示最新scene
 */
export const drawType = {
    LINE: 'line',
    SHAPE: 'shape',
    RECT: 'rect',
    POINT: 'point',
    RECT_TOOLTIP: 'rect_tooltip',
    LINE_REPLACE: 'line_replace',
    LINE_CONTINUOUS_COMPOSITE: 'line_continuous_composite',
    LINE_PARALLEL: 'line_parallel',
    LINE_SERIES_COMPOSITE: 'line_series_composite',
}

export const chartsBaseColor = {
    activeColor: '#1bab16',
    protrudeColor: '#b70a61',
    tooltipColor: '#0aa9b7',
    hoverColor: '#298029',
    weakColor: '#496977',
    transparent: 'transparent',
    normalColor: '#FAFAFA',
    fillNormalColor: '#1cc6d5',
}

export const renderModel = {
    // 根据优先级串行绘制，若存在动画效果，则等待其完成
    PRIORITY: 'priority',
    // 并行绘制，互不干扰
    PARALLEL: 'parallel',
    RANDOM: 'random',
}

export function G3Stage(dom, startParams) {
    const _this = this
    _this._canvasDom = dom
    _this._ctx = _this._canvasDom.getContext('2d')
    // ${type}: [], type<=>drawType
    _this._framesList = []
    // 图表启动参数
    _this._diagramStartParams = {
        category: '',  // 'array-relate' |
        animation: {
            duration: 1000,     // 默认动画持续时间
        },
        tooltip: {
            xDistance: 30,  // x点与鼠标默认距离
            yDistance: 40,  // y点与鼠标默认距离
        },
        width: 300,     // 默认画布宽度
        height: 300,    // 默认画布高度
        drawParams: {
            lineWidth: 2    // 默认线宽
        },
        color: {
            ...chartsBaseColor
        }
    }
    /*
    {
        runEngine: false,
        sceneStack: {
            contextState: {},
            renderModel: 'parallel', '> parallel < | priority | random'
            renderGroup: [
                {
                    members: [
                        {
                            id: <=> this.description.id,
                            description: {},
                            priority: number,
                            beforeRender: function
                        }
                    ],
                    priority: number,
                    duration: number,
                    beforeRender?: function,
                    type:  'line' | 'font' | 'point' | 'rect' | 'circular' | 'round' | 'line_parallel' | 'line_series' | 'line_replace'
                    state: 'active' | 'freezing', // freezing状态下渲染目标失去所有动画效果，且渲染优先级为最高“1”
                }
            ],
        }
    }
*/
    _this._renderContainer = {
        runEngine: false,
        sceneStack: [],
        trigger: 0
    }
    setStageStartParams(_this._diagramStartParams, startParams)

}

function performerFactory(stage) {
    function drawDiscreteLineSegment({description, beforeRender}, {afterCallback} = {}) {
        beforeRender && beforeRender(description)
        const {startCoordinate, endCoordinate, lineInfo} = description
        stage._ctx.strokeStyle = lineInfo.color
        stage._ctx.beginPath()
        stage._ctx.moveTo(startCoordinate.x, startCoordinate.y)
        stage._ctx.lineTo(endCoordinate.x, endCoordinate.y)
        stage._ctx.closePath()
        stage._ctx.lineWidth = lineInfo.width || stage._diagramStartParams.drawParams.lineWidth
        stage._ctx.stroke()
        afterCallback && afterCallback()
    }

    function drawNode({description, beforeRender}, {afterCallback} = {}) {
        beforeRender && beforeRender(description)
        const {x, y} = description.startCoordinate
        let {color, width, height} = description.shapeInfo
        const fontHeight = height - 10

        const linear = stage._ctx.createLinearGradient(x, y, x + width, y + height)
        if (!color || color.length === 0) {
            color = [1, chartsBaseColor.fillNormalColor]
        }
        for (const i in color) {
            if (Object.getPrototypeOf(color[i]) !== Array.prototype) {
                color[i] = [(+i + 1) / color.length, color[i]]
            }
            const [degree, c] = color[i]
            linear.addColorStop(degree, c)
        }

        stage._ctx.fillStyle = linear
        stage._ctx.fillRect(x, y, width, height)
        stage._ctx.font = `${fontHeight}px serif`;
        stage._ctx.fillStyle = description.fontInfo?.color ?? chartsBaseColor.normalColor
        stage._ctx.fillText(description.fontInfo?.label ?? '', x, y + fontHeight)
        afterCallback && afterCallback()
    }

    function drawDiscreteLineSegmentWithParallel({description, beforeRender, duration}, {afterCallback} = {}) {
        const {startCoordinate, endCoordinate, lineInfo} = description
        const {drawParams, animation} = stage._diagramStartParams
        const runDuration = duration || animation.duration

        let startTime = 0
        let prevX = startCoordinate.x
        let prevY = startCoordinate.y
        let nextX
        let nextY

        stage._ctx.lineWidth = lineInfo.width || drawParams.lineWidth

        const frame = requestAnimationFrame(function step(currentTime) {
            !startTime && (startTime = currentTime)
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / runDuration, 1)

            nextX = startCoordinate.x + (endCoordinate.x - startCoordinate.x) * progress
            nextY = startCoordinate.y + (endCoordinate.y - startCoordinate.y) * progress

            description.startCoordinate = {
                x: prevX,
                y: prevY
            }
            description.endCoordinate = {
                x: nextX,
                y: nextY
            }
            drawDiscreteLineSegment({description, beforeRender})

            prevX = nextX
            prevY = nextY

            if (progress < 1) {
                stage.addFrame(description, requestAnimationFrame(step))
            } else {
                afterCallback && afterCallback(description)
            }
        })
        stage.addFrame(description, frame)
    }

    return {
        typeDrawFunctionMap: {
            [drawType.RECT]: 'drawNode',
            [drawType.RECT_TOOLTIP]: 'drawNode',
            [drawType.LINE]: 'drawDiscreteLineSegment',
            [drawType.LINE_REPLACE]: 'drawDiscreteLineSegment',
            [drawType.LINE_CONTINUOUS_COMPOSITE]: 'drawContinuousLineSegment',
            [drawType.LINE_PARALLEL]: 'drawDiscreteLineSegmentWithParallel',
            [drawType.LINE_SERIES_COMPOSITE]: 'drawDiscreteLineSegmentWithSeries',
        },
        drawNode,
        drawDiscreteLineSegment,
        drawDiscreteLineSegmentWithParallel,
        drawDiscreteLineSegmentWithSeries: async ({
                                                      members,
                                                      beforeRender,
                                                      duration = 250
                                                  }, {afterCallback, forNo} = {}) => {
            const segmentDuration = duration / members.length
            for (const index in members) {
                const {description, ...other} = members[index]
                await new Promise((resolve) => {
                    drawDiscreteLineSegmentWithParallel(
                        {
                            description,
                            duration: segmentDuration,
                            beforeRender: other.beforeRender || beforeRender
                        },
                        {afterCallback: resolve}
                    )
                })
                index === forNo && afterCallback && afterCallback()
            }
        },
        drawContinuousLineSegment: ({members}, {afterCallback = null, forNo = 1} = {}) => {
            stage._ctx.beginPath()
            const diagramStartParams = stage._diagramStartParams
            for (const index in members) {
                const {startCoordinate, pointInfo} = members[index].description
                stage._ctx.lineWidth = pointInfo.entanglementLineWidth || diagramStartParams.drawParams.lineWidth
                stage._ctx.strokeStyle = pointInfo.entanglementColor || diagramStartParams.color.fillNormalColor

                if (index === '0') {
                    stage._ctx.moveTo(startCoordinate.x, startCoordinate.y)
                    continue
                }
                stage._ctx.lineTo(startCoordinate.x, startCoordinate.y)
                parseInt(index) === forNo && afterCallback && afterCallback()
            }
            stage._ctx.stroke()
        }
    }
}

function renderEngine(stage) {
    async function priorityRender(renderGroup) {
        renderGroup.sort((a, b) => a.priority - b.priority)
        renderGroup.forEach(({members}) => members.sort((a, b) => a.priority - b.priority))

        for (const {type, ...other} of renderGroup) {
            const draw = context[context.typeDrawFunctionMap[type]]
            await new Promise((resolve) => {
                if (type.endsWith('_composite')) {
                    let forNo = other.members.length - 1
                    // HACK
                    const position = 1
                    draw(other, {afterCallback: resolve, forNo: (forNo * position).toFixed()})
                } else {
                    for (let {description, beforeRender} of other.members) {
                        draw({description, beforeRender, duration: other.duration})
                    }
                    resolve()
                }
            })
        }
    }

    async function parallelRender(renderGroup) {
        Promise.all(renderGroup.map(item => {
            const draw = context[context.typeDrawFunctionMap[item.type]]
            if (!draw) {
                throw new Error(`${ERROR_PREFIX} Unable to find the drawing function corresponding to the type '${item.type}' of the described object.`)
            }
            return new Promise((resolve) => {
                if (item.type.endsWith('_composite')) {
                    draw(item)
                } else {
                    for (const {description, beforeRender} of item.members) {
                        draw({description, beforeRender, duration: item.duration})
                    }
                }
                resolve()
            })
        }))
    }

    // 获取sceneStack的最新渲染对象，根据renderItem的key所对应的绘制方法绘制图形
    watch(renderContainer, ({runEngine, sceneStack}) => {
        if (!runEngine) {
            return
        }
        const lastRenderOption = deepClone(sceneStack[sceneStack.length - 1])
        const renderModelSwitch = {
            // 优先级串行绘制
            [renderModel.PRIORITY]: priorityRender,
            // 全并行绘制
            [renderModel.PARALLEL]: parallelRender
        }
        const {width, height} = context.getDiagramStartParams()
        context.clearFrameAndRect(0, 0, width, height)
        renderModelSwitch[lastRenderOption.renderModel](lastRenderOption.renderGroup)
        renderContainer.runEngine = false
    }, {deep: true})
}
function setStageStartParams(currentParams, config) {
    if (isNotObject(config)) {
        throw new Error(`${ERROR_PREFIX}The type of diagram config must be an Object.`)
    }
    if (!('category' in config)) {
        throw new Error(`${ERROR_PREFIX}The diagram config must hava a 'category' field.`)
    }

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
    recursionAssign(currentParams, config)
}

G3Stage.prototype.getFrameList = function (typeAndId) {
    return Object.keys(this._framesList).filter(key => key.startsWith(typeAndId)).map(item => this._framesList[item]).flat()
}
G3Stage.prototype.addFrame = function (description, frame) {
    const type = description.type + '_' + description.id
    if (!this._framesList[type]) {
        this._framesList[type] = []
    }
    this._framesList[type].push(frame)
}
G3Stage.prototype.clearFrameAndRect = function (x, y, w, h, typeDesc) {
    let frameList = ''
    if (typeDesc) {
        const {type, id = ''} = typeDesc
        const typeAndId = `${type}_${id}`
        frameList = G3Stage.prototype.getFrameList.call(this, typeAndId)
        frameList && frameList.forEach(item => cancelAnimationFrame(item))
    } else {
        frameList = G3Stage.prototype.getFrameList.call(this, '')
        frameList && frameList.forEach(item => cancelAnimationFrame(item))
    }
    this._ctx.clearRect(x, y, w, h)
}
G3Stage.prototype.pushRenderScene = function ({renderGroup, renderModel = 'parallel'}, run = true) {
    this._ctx.save()
    this._renderContainer.sceneStack.push({renderGroup, renderModel})
    this._renderContainer.runEngine = run
}
G3Stage.prototype.popRenderScene = function (index = 1, run = true) {
    index = Math.min(index, this._renderContainer.sceneStack.length - 1)
    for (let i = 0; i < index; i++) {
        this._ctx.restore()
        this._renderContainer.sceneStack.pop()
        this._renderContainer.runEngine = run
    }
}
G3Stage.prototype.getNewestRenderScene = function () {
    const sceneStack = this._renderContainer.sceneStack;
    return {
        scene: sceneStack[sceneStack.length - 1],
        index: sceneStack.length - 1
    }
}
G3Stage.prototype.updateRenderScene = function (callback, index, run = true) {
    if (callback) {
        callback(this._renderContainer.sceneStack[index])
        this._renderContainer.runEngine = run
    }
}
G3Stage.prototype.updateNewestRenderScene = function (callback, run = true) {
    if (callback) {
        callback(this.getNewestRenderScene())
        this._renderContainer.runEngine = run
    }
}
G3Stage.prototype.addEvent = function (eventName, callback) {
    this._canvasDom.addEventListener(eventName, callback)
}
G3Stage.prototype.addEvent = function (eventName, callback) {
    this._canvasDom.removeEventListener(eventName, callback)
}