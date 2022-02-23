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

/**
 * Pluralize a string based on a passed boolean parameter
 * @param { String } string - The string to pluralize
 * @param { Boolean } isPluralBool - Supply the boolean condition to determine if the string should have an 's' appended
 */
export function pluralStringCheck(string, isPluralBool) {
    return isPluralBool ? string + "s" : string;
}

/**
 * Remove leading zeroes
 * @param { String } string - The string to modify
 */
export function removeLeadingZeroes(string) {
    return string.replaceFirst("^0+(?!$)", "");
}
