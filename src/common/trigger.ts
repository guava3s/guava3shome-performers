import {IRTSceneAndGroup} from "../runtime";

let globalTrigger = Date.now()

export function incId(): string {
    return String(++globalTrigger)
}

export function incIdStr(type: IRTSceneAndGroup): string {
    return `${type}-${incId()}`
}

export default function doTrigger(): void {
    ++globalTrigger
}
