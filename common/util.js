import {ERROR_PREFIX} from "./enum.js";

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

export function isObject(item) {
    return Object.getPrototypeOf(item) === Object.prototype
}

export function isNotObject(item) {
    return Object.getPrototypeOf(item) !== Object.prototype
}

export function generateUUID() {
    const data = new Uint8Array(16);
    window.crypto.getRandomValues(data);

    data[6] &= 0x0f;
    data[6] |= 0x40;

    data[8] &= 0x3f;
    data[8] |= 0x80;

    let uuid = '';
    for (let i = 0; i < data.length; i++) {
        if (i === 4 || i === 6 || i === 8 || i === 10) {
            uuid += '-';
        }

        const hex = data[i].toString(16).padStart(2, '0');
        uuid += hex;
    }

    return uuid;
}

export function toObjBy(list, byField) {
    return list.reduce((result, item) => {
        const split = byField.split(".")
        let key = ''
        for (let i = 0; i < split.length; i++) {
            if (!key) {
                key = item[split[i]]
            } else if (Object.getPrototypeOf(key) === Object.prototype) {
                key = key[split[i]]
            } else {
                throw new Error(`${ERROR_PREFIX} The value corresponding to the '${byField}' field is an string and should be a object.`)
            }
        }
        if (Object.getPrototypeOf(key) === Object.prototype) {
            throw new Error(`${ERROR_PREFIX} The value corresponding to the '${byField}' field is an object and should be a string.`)
        }
        result[key] = item
        return result
    }, {})
}

export function groupBy(list, byField, exclude) {
    return list.reduce((result, item) => {
        if (exclude && exclude(item[byField])) {
            return result
        }
        const groupElement = result[item[byField]];
        if (groupElement) {
            groupElement.push(item)
        } else {
            result[item[byField]] = [item]
        }
        return result
    }, {})
}
