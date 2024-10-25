import {generateUUID} from "../common/util.js";
import {G3Stage} from "../core.js"
import {chartsBaseColor, drawType, renderModel} from "../common/enum.js";

export default function usePerformersArrayRelate(doms, startParams = {
    category: 'array-relate',
    width: 600,
    height: 600
}, instanceParams) {

    const stages = doms.map(dom => new G3Stage(dom, startParams))
    const [mainStage] = stages

    const {
        nodeWrapper,
        boardWrapper,
        scaleFactorX,
        scaleFactorY,
        nodeDict,
        diagramStructure,
        treeData
    } = instanceParams

    // 计算节点与线轨迹
    function calcPerformerTrajectory() {
        /*
          可用区域
          key: {x,y,width,height}
          value:node
        */
        const usableAreaMap = new Map()

        // 计算命中区域
        function calcAreaKey(offsetX, offsetY) {
            const {width, height, areaX, areaY} = nodeWrapper
            const [intPartX, floatPartX] = String((offsetX - boardWrapper.paddingX) / areaX).split(".")
            const [intPartY, floatPartY] = String((offsetY - boardWrapper.paddingY) / areaY).split(".")
            let x = 0, y = 0
            if (intPartX < 1) {
                if (`${intPartX}.${floatPartX}` > scaleFactorX) {
                    return 'null1'
                } else {
                    x = width
                }
            } else if (floatPartX) {
                if (('0.' + floatPartX) > scaleFactorX) {
                    return 'null2'
                } else {
                    x = (areaX * intPartX) + width
                }
            } else {
                x = (areaX * intPartX)
            }

            if (intPartY < 1) {
                if (`${intPartY}.${floatPartY}` > scaleFactorY) {
                    return 'null3'
                } else {
                    y = height
                }
            } else if (floatPartY) {
                if (('0.' + floatPartY) > scaleFactorY) {
                    return 'null4'
                } else {
                    y = (areaY * intPartY) + height
                }
            } else {
                y = (areaY * intPartY)
            }
            return `${x + boardWrapper.paddingX},${y + boardWrapper.paddingY}`
        }

        // 计算线段轨迹
        function calcLine(list, startCoordinate, lineColor,) {
            for (const obj of list) {
                const {x, y} = obj.description.startCoordinate
                const {width, height} = nodeWrapper
                if (obj.meta.parentName && obj.meta.parentName !== '_NODE_LEADER_' && startCoordinate) {

                    const endCoordinate = {x: startCoordinate.x + boardWrapper.gapX / 2, y: y + height / 2}

                    let tempCoordinate = startCoordinate
                    if (endCoordinate.y !== startCoordinate.y) {
                        tempCoordinate = {x: startCoordinate.x, y: endCoordinate.y}
                        nodeDict[obj.meta.name].lines.push({
                            id: generateUUID(),
                            owner: obj.meta.name,
                            type: drawType.LINE,
                            startCoordinate,
                            endCoordinate: tempCoordinate,
                            lineInfo: {
                                color: lineColor
                            },
                            active: true
                        })
                    }

                    nodeDict[obj.meta.name].lines.push({
                        id: generateUUID(),
                        owner: obj.meta.name,
                        type: drawType.LINE,
                        startCoordinate: tempCoordinate,
                        endCoordinate,
                        lineInfo: {
                            color: lineColor
                        },
                        active: true
                    })
                }

                if (obj.children?.length > 0) {
                    const startX = x + width;
                    const endY = y + height / 2;
                    const endCoordinate = {x: startX + boardWrapper.gapX / 2, y: endY};
                    let startCoordinate = {x: startX, y: endY};
                    nodeDict[obj.meta.name].lines.push({
                        id: generateUUID(),
                        owner: obj.meta.name,
                        type: drawType.LINE,
                        startCoordinate,
                        endCoordinate,
                        lineInfo: {
                            color: obj.description.shapeInfo.followerLineColor
                        },
                        active: true
                    })

                    calcLine(obj.children, endCoordinate, obj.description.lineColor)
                }
            }
        }

        return {
            usableAreaMap,
            calcAreaKey,
            calcLine,
            calcEntryNode() {
                Object.values(diagramStructure).forEach((values, i) => {
                    values.forEach((meta, j) => {
                        const {width, height, areaX, areaY} = nodeWrapper
                        const offsetX = i * areaX
                        const offsetY = j * areaY
                        const startCoordinate = {x: boardWrapper.paddingX + offsetX, y: boardWrapper.paddingY + offsetY}
                        nodeDict[meta.name].description = {
                            id: generateUUID(),
                            startCoordinate,
                            node: meta,
                            type: drawType.SHAPE,
                            hitDetail: {
                                move: false,
                                click: false
                            },
                            shapeInfo: {
                                color: [chartsBaseColor.hoverColor, '#bbc01b'],
                                followerLineColor: `#${Math.random().toString().slice(3, 9).toString(16)}`,
                                width,
                                height,
                                nodeShape: 'rect'
                            },
                            fontInfo: {
                                label: meta.title
                            }
                        }
                        // 构建区域位图
                        usableAreaMap.set(`${startCoordinate.x + width},${startCoordinate.y + height}`, nodeDict[meta.name])
                    })
                })
            },
            calcTooltip(node, mouseCoordinate) {
                const {x, y} = mouseCoordinate
                const {xDistance, yDistance} = mainStage.getStartParams().tooltip
                const id = generateUUID();
                return {
                    id,
                    startCoordinate: {
                        x: x + xDistance,
                        y: y + yDistance
                    },
                    node: node.meta,
                    type: drawType.SHAPE,
                    active: true,
                    hitDetail: {
                        move: false,
                        click: false
                    },
                    shapeInfo: {
                        color: [chartsBaseColor.tooltipColor],
                        followerLineColor: `#${Math.random().toString().slice(3, 9).toString(16)}`,
                        width: node.description.shapeInfo.width + xDistance,
                        height: node.description.shapeInfo.height + yDistance,
                        nodeShape: 'rect'
                    },
                    fontInfo: {
                        label: node.meta.title
                    }
                }
            }
        }
    }

    const {calcEntryNode, calcLine, calcAreaKey, usableAreaMap, calcTooltip} = calcPerformerTrajectory()

    // 第一场
    function opChartsGenerateFirst(treeData) {
        const {nodeDescs, linesDescs} = extract(treeData)
        mainStage.pushScene({
            renderGroup: [
                {
                    members: nodeDescs,
                    priority: 1,
                    duration: 0,
                    type: drawType.RECT
                },
                {
                    members: linesDescs,
                    priority: 2,
                    duration: 400,
                    type: drawType.LINE_PARALLEL
                }
            ]
        })
    }

    // 悬浮突出场
    function opChartsProtrudeRelateNode(node) {
        const nodeLines1 = extract(treeData.filter(item => item.rootName !== node.rootName), (desc) => {
            if (desc.type !== drawType.SHAPE) {
                desc.lineInfo.color = chartsBaseColor.transparent
            }
        })
        const nodeLines2 = extract(treeData.filter(item => item.rootName === node.rootName), (desc) => {
            if (desc.type === drawType.SHAPE) {
                desc.shapeInfo.color = [chartsBaseColor.protrudeColor, '#bbc01b']
            } else {
                desc.lineInfo.color = chartsBaseColor.protrudeColor
            }
        })
        mainStage.pushScene({
            renderModel: renderModel.PRIORITY,
            renderGroup: [
                {
                    members: nodeLines1.nodeDescs.concat(nodeLines2.nodeDescs),
                    priority: 1,
                    duration: 0,
                    type: drawType.RECT
                },
                {
                    members: nodeLines1.linesDescs,
                    priority: 2,
                    duration: 0,
                    type: drawType.LINE
                },
                {
                    members: nodeLines2.linesDescs,
                    priority: 3,
                    duration: 400,
                    type: drawType.LINE_SERIES_COMPOSITE
                }
            ]
        }, false)
    }

    // 悬浮提示场
    function opChartsDeriveTooltip(node, mouseCoordinate) {
        const description = calcTooltip(node, mouseCoordinate)
        mainStage.updateNewestScene(({scene}) => {
            const rectTooltip = scene.groups.find(item => item.model === drawType.RECT_TOOLTIP)
            if (rectTooltip) {
                scene.mode = renderModel.PARALLEL
                rectTooltip.members = [{
                    id: description.id,
                    description,
                    priority: 1
                }]
            } else {
                scene.groups.push({
                    members: [{
                        id: description.id,
                        description,
                        priority: 1
                    }],
                    model: drawType.RECT_TOOLTIP,
                    priority: Date.now()
                })
            }
        })
    }

    return {
        stages,
        calcEntryNode,
        calcLine,
        calcAreaKey,
        calcTooltip,
        usableAreaMap,
        opChartsGenerateFirst,
        opChartsProtrudeRelateNode,
        opChartsDeriveTooltip
    }
}

function extract(treeData, renderCallback) {
    let count = 1
    const nodeDescs = [], linesDescs = []
    const runExtract = (list, beforeRender) => {
        for (const item of list) {
            nodeDescs.push({
                description: item.description,
                priority: ++count,
                beforeRender
            })
            linesDescs.push(...item.lines.map(e => {
                return {
                    description: e,
                    priority: ++count,
                    beforeRender
                }
            }))
            if (item.children?.length) {
                runExtract(item.children, beforeRender)
            }
        }
    }
    runExtract(treeData, renderCallback)
    return {nodeDescs, linesDescs, priority: count}
}
