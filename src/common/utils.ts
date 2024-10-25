export function isObject(item: any): boolean {
    return Object.getPrototypeOf(item) === Object.prototype
}

export function isNotObject(item: any): boolean {
    return Object.getPrototypeOf(item) !== Object.prototype
}

export function deepClone<T>(target: any): T {
    let result: any;
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

export function generateUUID(): string {
    const data = new Uint8Array(16);
    window.crypto.getRandomValues(data);

    data[6] &= 0x0f;
    data[6] |= 0x40;

    data[8] &= 0x3f;
    data[8] |= 0x80;

    let uuid: string = '';
    for (let i = 0; i < data.length; i++) {
        if (i === 4 || i === 6 || i === 8 || i === 10) {
            uuid += '-';
        }

        const hex = data[i].toString(16).padStart(2, '0');
        uuid += hex;
    }

    return uuid;
}

export function emptyFunc(): any {
}
