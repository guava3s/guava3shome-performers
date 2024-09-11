/**
 * 深拷贝对象
 * @param target 目标对象
 * @returns {{}}
 */
export function deepClone(target) {
    let result;
    if (typeof target === 'object') {
        if (Array.isArray(target)) {
            result = [];
            for (const i in target) {
                result.push(deepClone(target[i]))
            }
        } else if (target === null) {
            result = null;
        } else if (target.constructor === RegExp) {
            result = target;
        } else if (target.constructor === Date) {
            result = target;
        } else {
            result = {};
            for (const i in target) {
                result[i] = deepClone(target[i]);
            }
        }
    } else {
        result = target;
    }
    return result;
}

export function isObject(item){
    return Object.getPrototypeOf(item) === Object.prototype
}

export function isNotObject(item){
    return Object.getPrototypeOf(item) !== Object.prototype
}