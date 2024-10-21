import {SETTING_COLORS} from "./Colors";

export interface MetaConfig {
    // 默认画布宽度
    readonly width: number
    // 默认画布高度
    readonly height: number
    animation?: MetaConfigAnimation
    tooltip?: MetaConfigToolTip
    drawParams?: MetaConfigDrawParams
    colors?: SETTING_COLORS
}

export interface MetaConfigToolTip {
    // x点与鼠标默认距离
    readonly xDistance: number
    // y点与鼠标默认距离
    readonly yDistance: number
}

export interface MetaConfigAnimation {
    // 默认动画持续时间
    readonly duration: number
}

export interface MetaConfigDrawParams {
    // 默认线宽
    readonly lineWidth: number
}
