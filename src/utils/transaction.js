
export const transactionTypes = {
    DATA_STORE: 1,
    VALUE_STORE: 2,
    ATOMIC_SWAP_STORE: 3,
}

export const transactionStatus = {
    CREATION: 1,
    LOADING: 2,
    INSPECTION: 3,
}


/**
 * Creates and returns a standardized ValueStoreObject
 * @returns { Object } ValueStoreObject
 */
export const createValueStoreObject = (fromAddress, toAddress, value, bnCurve = false) => {
    return {
        type: "VS",
        name: "Value Store",
        fromAddress: fromAddress,
        value: value,
        toAddress: toAddress,
        bnCurve: bnCurve,
    }
}

/**
 * Creates and returns a standardized DataStoreObject
 * @returns { Object } DataStoreObject
 */
export const createDataStoreObject = (fromAddress, index, rawData, duration) => {
    return {
        type: "DS",
        name: "Data Store",
        fromAddress: fromAddress,
        index: index,
        rawData: rawData,
        duration: duration,
        bnCurve: false,
    }
}


/**
 * Async promise waiter, used for artificial waiting
 * @param msLength - How long to wait in ms
 * @param callerId - Supply to assist in debugging, if you so desire
 */
export const waitFor = (msLength, callerId) => {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, msLength)
    });
}

/**
 * Splits a string with an ellipses, leaving designated length on both sides
 * @param {string} str - String to split
 * @param {int} lengthOnSides - How many characters to leave on sides of the ellipses
 */
export function splitStringWithEllipsis(str, lengthOnSides = 3) {
    if (typeof str !== "string") {
        return "";
    }
    return str.slice(0, lengthOnSides)
        + "..."
        + str.slice(str.length - lengthOnSides, str.length);
}