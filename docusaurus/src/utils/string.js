/**
 * Fills interior of a string with an ellipses and leaves charCountToLeave on both sides
 * @param { String } strToSplit - The string to split with the ellipses 
 * @param { Number } charCountToLeave  - Characters to leave on the end of the string
 */
export function splitStringWithEllipses(strToSplit, charCountToLeave) {
    let start = strToSplit.slice(0, charCountToLeave);
    let end = strToSplit.slice(strToSplit.length - charCountToLeave, strToSplit.length);
    return start + "..." + end;
}

