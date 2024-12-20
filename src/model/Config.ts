import {SETTING_COLORS} from "./Colors";

export interface MetaConfig {
    // 默认画布宽度
    width: number | 0
    // 默认画布高度
    height: number | 0
    animation?: MetaConfigAnimation
    tooltip?: MetaConfigToolTip
    drawParams?: MetaConfigDrawParams
    // 若存在动画时，计算在距离动画结束多久(0-1)时，直接渲染下一组
    approachEndAppearance?: number
    // 场景数据变化时强制自动刷新
    useForceAutoRefresh?: boolean
    // 场景切换过渡
    useSceneTransition?: boolean
}

export interface MetaConfigToolTip {
    // x点与鼠标默认距离
    xDistance: number
    // y点与鼠标默认距离
    yDistance: number
}

export interface MetaConfigAnimation {
    // 默认动画持续时间
    duration: number
}

export interface MetaConfigDrawParams {
    // 默认线宽
    lineWidth?: number,
    colors?: SETTING_COLORS
}
