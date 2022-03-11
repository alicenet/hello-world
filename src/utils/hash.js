import { ethers } from 'ethers';

/**
 * Return keccak256 hash of an input
 * @param { String } - String to return as a keccak256 hash
 */
export function keccak256(input) {
    return ethers.utils.keccak256(input);
}

/**
 * Take a hex string and try to parse to utf8
 * @param {*} hexString 
 * @returns 
 */
export function hexToUtf8Str(hexString) {
    let parsed = false;
    try {
        parsed = decodeURIComponent(
            hexString.replace(/\s+/g, '')
                .replace(/[0-9a-f]{2}/g, '%$&')
        );
    } catch (ex) {
        log.error(ex);
    }
    return parsed
}