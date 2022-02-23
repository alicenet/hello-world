import { ethers } from 'ethers';

/**
 * Generate and return a new JSON blob representing the data for a keystore.
 * @param { Boolean } asBlob - Return keystore as a blob?
 * @param { String } password - Password to secure the keystore with
 * @param { CurveType } curve - Curve if desired, default to type 1
 * @returns { Blob || JSON String } - JSON Blob || Json String
 */
export async function generateKeystore(asBlob, password) {
    const wallet = ethers.Wallet.createRandom();
    const keystore = await wallet.encrypt(password);
    let ksJSONBlob = new Blob([JSON.stringify(keystore, null, 2)]);
    return asBlob ? ksJSONBlob : keystore;
}

/**
 * Generated a keystore object from a privateKey
 * @param {*} privK
 * @param {*} password
 * @param {*} asBlob
 */
export async function generateKeystoreFromPrivK(privK, password, asBlob) {
    const wallet = new ethers.Wallet(privK)
    const keystore = await wallet.encrypt(password);
    let ksJSONBlob = new Blob([JSON.stringify(keystore, null, 2)]);
    return asBlob ? ksJSONBlob : keystore;
}

/**
 * Unlock a keystore using ethers
 * @param {*} keystore - Keystore JSON to unlock
 * @param {*} password - Password to use to unlock the json
 */
export async function unlockKeystore(keystore, password) {
    try {
        let unlocked = await ethers.Wallet.fromEncryptedJson([keystore], password);
        return unlocked;
    } catch (ex) {
        return { error: ex }
    }
}
