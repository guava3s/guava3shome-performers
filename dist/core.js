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
exports.useRenderEngine = useRenderEngine;
const waitingHall_1 = require("./waitingHall");
const enums_1 = require("./common/enums");
function useRenderEngine(stage) {
    return {
        [enums_1.STAGE_RENDER_MODEL.PRIORITY]: function (groups) {
            return __awaiter(this, void 0, void 0, function* () {
                groups.sort((a, b) => a.priority - b.priority);
                groups.forEach(({ members }) => members.sort((a, b) => a.priority - b.priority));
                for (const group of groups) {
                    const { model } = group, other = __rest(group, ["model"]);
                    const render = (0, waitingHall_1.callPerformerRender)(model, other.members);
                    // 组内渲染
                    yield new Promise((resolve) => render === null || render === void 0 ? void 0 : render(group, stage, resolve));
                }
            });
        },
        [enums_1.STAGE_RENDER_MODEL.PARALLEL]: function (groups) {
            return __awaiter(this, void 0, void 0, function* () {
                Promise.all(groups.map((item) => {
                    const { model } = item, other = __rest(item, ["model"]);
                    const render = (0, waitingHall_1.callPerformerRender)(model, other.members);
                    return new Promise((resolve) => {
                        render === null || render === void 0 ? void 0 : render(item, stage).finally(() => resolve());
                    });
                }));
            });
        }
    };
}
