export interface MetaConfig {
    category?: string
    // 默认画布宽度
    readonly width: number
    // 默认画布高度
    readonly height: number
    readonly animation: MetaConfigAnimation
    readonly tooltip: MetaConfigToolTip
    readonly drawParams: MetaConfigDrawParams
}

export interface MetaConfigToolTip {
    readonly xDistance: number
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
