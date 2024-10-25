"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerDescriptionInstance = void 0;
const trigger_1 = require("../common/trigger");
class PerformerDescriptionInstance {
    constructor(type) {
        this.type = type;
        this.id = (0, trigger_1.incId)();
        this.fillPerformer();
    }
    static generator(...args) {
        return new this(...args);
    }
}
exports.PerformerDescriptionInstance = PerformerDescriptionInstance;
