export const ERROR_PREFIX = "[Guava3shome Error] >> "

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
    ENTITY: 'entity',
    POINT: 'point',
    RECT_TOOLTIP: 'rect_tooltip',
    LINE_REPLACE: 'line_replace',
    LINE_CONTINUOUS_COMPOSITE: 'line_continuous_composite',
    LINE_PARALLEL: 'line_parallel',
    LINE_SERIES_COMPOSITE: 'line_series_composite',
    ENTITY_PARALLEL: 'entity_parallel',
    ENTITY_SERIES: 'entity_series',
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