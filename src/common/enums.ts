export const ERROR_PREFIX = "[Guava3shome Error] >> "
export enum DRAY_TYPE {
    LINE = 'line',
    SHAPE = 'shape',
    RECT = 'rect',
    ENTITY = 'entity',
    POINT = 'point',
    RECT_TOOLTIP = 'rect_tooltip',
    LINE_REPLACE = 'line_replace',
    LINE_CONTINUOUS_COMPOSITE = 'line_continuous_composite',
    LINE_PARALLEL = 'line_parallel',
    LINE_SERIES_COMPOSITE = 'line_series_composite',
    ENTITY_PARALLEL = 'entity_parallel',
    ENTITY_SERIES = 'entity_series',
}

export enum CHARTS_BASE_COLOR {
    activeColor = '#1bab16',
    protrudeColor = '#b70a61',
    tooltipColor = '#0aa9b7',
    hoverColor = '#298029',
    weakColor = '#496977',
    transparent = 'transparent',
    normalColor = '#FAFAFA',
    fillNormalColor = '#1cc6d5',
}

export enum PERFORMER_TYPE {
    line = 'line',
    font = 'font',
    point = 'point',
    image = 'image',
    rect = 'rect',
    circular = 'circular',
    round = 'round',
    curve = 'curve',
}

/**
 * 本组成员调度指导
 */
export enum STAGE_GROUP_GUIDE {
    line_normal = 'line_normal',
    line_parallel = 'line_parallel',
    line_series = 'line_series',
    line_replace = 'line_replace',

    curve_normal = 'curve_normal',

    point_normal = 'point_normal',

    round_normal = 'round_normal',

    rect_normal = 'rect_normal',

    font_normal = 'font_normal',

    circular_normal = 'circular_normal',
}

export enum STAGE_RENDER_MODEL {
    // 并行绘制，互不干扰
    parallel = 'parallel',
    // 根据优先级串行绘制，若存在动画效果，则等待其完成
    priority = 'priority',
    random = 'random'
}
