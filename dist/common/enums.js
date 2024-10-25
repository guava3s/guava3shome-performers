"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAGE_RENDER_MODEL = exports.STAGE_GROUP_GUIDE = exports.PERFORMER_TYPE_MAP = exports.PERFORMER_TYPE = exports.CHARTS_BASE_COLOR = exports.ERROR_PREFIX = void 0;
const PrLine_1 = require("../base/PrLine");
exports.ERROR_PREFIX = "[Guava3shome Error] >> ";
var CHARTS_BASE_COLOR;
(function (CHARTS_BASE_COLOR) {
    CHARTS_BASE_COLOR["activeColor"] = "#1bab16";
    CHARTS_BASE_COLOR["protrudeColor"] = "#b70a61";
    CHARTS_BASE_COLOR["tooltipColor"] = "#0aa9b7";
    CHARTS_BASE_COLOR["hoverColor"] = "#298029";
    CHARTS_BASE_COLOR["weakColor"] = "#496977";
    CHARTS_BASE_COLOR["transparent"] = "transparent";
    CHARTS_BASE_COLOR["normalColor"] = "#FAFAFA";
    CHARTS_BASE_COLOR["reBackgroundColor"] = "#000000";
    CHARTS_BASE_COLOR["fillNormalColor"] = "#1cc6d5";
})(CHARTS_BASE_COLOR || (exports.CHARTS_BASE_COLOR = CHARTS_BASE_COLOR = {}));
var PERFORMER_TYPE;
(function (PERFORMER_TYPE) {
    // RECT = 'RECT',
    PERFORMER_TYPE["LINE"] = "LINE";
    // FONT = 'FONT',
    // POINT = 'POINT',
    // IMAGE = 'IMAGE',
    // CIRCULAR = 'CIRCULAR',
    // ROUND = 'ROUND',
    // CURVE = 'CURVE',
})(PERFORMER_TYPE || (exports.PERFORMER_TYPE = PERFORMER_TYPE = {}));
exports.PERFORMER_TYPE_MAP = {
    LINE: PrLine_1.PrLine
};
/**
 * 本组成员调度指导
 */
var STAGE_GROUP_GUIDE;
(function (STAGE_GROUP_GUIDE) {
    STAGE_GROUP_GUIDE["line_normal"] = "line_normal";
    STAGE_GROUP_GUIDE["line_parallel"] = "line_parallel";
    STAGE_GROUP_GUIDE["line_series"] = "line_series";
    STAGE_GROUP_GUIDE["line_replace"] = "line_replace";
    STAGE_GROUP_GUIDE["curve_normal"] = "curve_normal";
    STAGE_GROUP_GUIDE["point_normal"] = "point_normal";
    STAGE_GROUP_GUIDE["round_normal"] = "round_normal";
    STAGE_GROUP_GUIDE["rect_normal"] = "rect_normal";
    STAGE_GROUP_GUIDE["font_normal"] = "font_normal";
    STAGE_GROUP_GUIDE["circular_normal"] = "circular_normal";
})(STAGE_GROUP_GUIDE || (exports.STAGE_GROUP_GUIDE = STAGE_GROUP_GUIDE = {}));
var STAGE_RENDER_MODEL;
(function (STAGE_RENDER_MODEL) {
    // 并行绘制，互不干扰
    STAGE_RENDER_MODEL["PARALLEL"] = "PARALLEL";
    // 根据优先级串行绘制，若存在动画效果，则等待其完成
    STAGE_RENDER_MODEL["PRIORITY"] = "PRIORITY";
    STAGE_RENDER_MODEL["PRIORITY_RANDOM"] = "RANDOM";
})(STAGE_RENDER_MODEL || (exports.STAGE_RENDER_MODEL = STAGE_RENDER_MODEL = {}));
