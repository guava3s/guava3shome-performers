"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrLine = void 0;
const Performer_1 = require("../model/Performer");
const enums_1 = require("../common/enums");
class PrLine extends Performer_1.PerformerDescriptionInstance {
    constructor(startCoordinate, endCoordinate, id) {
        super(enums_1.PERFORMER_TYPE.LINE);
        this.startCoordinate = startCoordinate;
        this.endCoordinate = endCoordinate;
        this.id = id;
        this.color = enums_1.CHARTS_BASE_COLOR.reBackgroundColor;
        this.width = 1;
    }
    perform(stage, _a, afterCallback) {
        var { description } = _a, item = __rest(_a, ["description"]);
        item.beforeRender && (item.beforeRender(description));
        const { startCoordinate, endCoordinate, width } = this;
        stage._ctx.strokeStyle = this.color;
        stage._ctx.beginPath();
        stage._ctx.moveTo(startCoordinate.x, startCoordinate.y);
        stage._ctx.lineTo(endCoordinate.x, endCoordinate.y);
        stage._ctx.closePath();
        stage._ctx.lineWidth = width;
        stage._ctx.stroke();
        afterCallback && afterCallback();
    }
    fillPerformer() {
    }
}
exports.PrLine = PrLine;
