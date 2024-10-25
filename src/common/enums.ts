import {PrLine} from "../base/PrLine";

export const ERROR_PREFIX = "[Guava3shome Error] >> "

export enum CHARTS_BASE_COLOR {
    activeColor = '#1bab16',
    protrudeColor = '#b70a61',
    tooltipColor = '#0aa9b7',
    hoverColor = '#298029',
    weakColor = '#496977',
    transparent = 'transparent',
    normalColor = '#FAFAFA',
    reBackgroundColor = '#000000',
    fillNormalColor = '#1cc6d5',
}

export enum PERFORMER_TYPE {
    // RECT = 'RECT',
    LINE = 'LINE',
    // FONT = 'FONT',
    // POINT = 'POINT',
    // IMAGE = 'IMAGE',
    // CIRCULAR = 'CIRCULAR',
    // ROUND = 'ROUND',
    // CURVE = 'CURVE',
}

export const PERFORMER_TYPE_MAP = {
    LINE: PrLine
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
    PARALLEL = 'PARALLEL',
    // 根据优先级串行绘制，若存在动画效果，则等待其完成
    PRIORITY = 'PRIORITY',
    PRIORITY_RANDOM = 'RANDOM'
}
