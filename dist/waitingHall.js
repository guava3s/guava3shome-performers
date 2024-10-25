"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.callPerformerRender = callPerformerRender;
// 返回该组的渲染形式函数
function callPerformerRender(model, members) {
    const performerTypes = members.map(item => item.description.type);
    const type = performerTypes.pop();
    if (performerTypes.every(item => item === type)) {
        const render = renderDict[`${model}_${type}`];
        if (render) {
            return render;
        }
        throw new Error(`The render Dictionary does not exist ${model}_ ${type} function`);
    }
    // TODO 提供报错信息
}
const renderDict = {
    PARALLEL_RECT: renderParallelRect,
    PARALLEL_LINE: renderParallelLine,
    PRIORITY_LINE: renderPriorityLine,
};
function renderParallelRect(group, stage, afterCall) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function renderParallelLine(group, stage, afterCall) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function renderPriorityRect(group, stage, afterCall) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function renderPriorityLine(_a, stage, afterCall) {
    return __awaiter(this, void 0, void 0, function* () {
        var { members, duration } = _a, other = __rest(_a, ["members", "duration"]);
        for (const index in members) {
            const member = members[index];
            if (member.duration > 0) {
                yield linePerformAnimation(stage, member, afterCall);
            }
            else {
                yield linePerform(stage, member, afterCall);
            }
        }
    });
}
function linePerform(stage, _a, afterCallback) {
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
    item.afterRender && item.afterRender(description);
    afterCallback && afterCallback();
}
function linePerformAnimation(stage, member, afterCallback) {
    const { description } = member, item = __rest(member, ["description"]);
    const { startCoordinate, endCoordinate, lineInfo } = description;
    const { drawParams, animation } = stage.getStartParams();
    const runDuration = item.duration;
    let startTime = 0;
    let prevX = startCoordinate.x;
    let prevY = startCoordinate.y;
    let nextX;
    let nextY;
    stage._ctx.lineWidth = lineInfo.width || drawParams.lineWidth;
    const frame = requestAnimationFrame(function step(currentTime) {
        !startTime && (startTime = currentTime);
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / runDuration, 1);
        nextX = startCoordinate.x + (endCoordinate.x - startCoordinate.x) * progress;
        nextY = startCoordinate.y + (endCoordinate.y - startCoordinate.y) * progress;
        description.startCoordinate = {
            x: prevX,
            y: prevY
        };
        description.endCoordinate = {
            x: nextX,
            y: nextY
        };
        linePerform(stage, member);
        prevX = nextX;
        prevY = nextY;
        if (progress < 1) {
            stage._addActionFrame(description, requestAnimationFrame(step));
        }
        else {
            afterCallback && afterCallback(description);
        }
    });
    stage._addActionFrame(description, frame);
}
