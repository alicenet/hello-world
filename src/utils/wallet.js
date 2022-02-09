import Web3 from 'web3';

const MadNetWalletJS = require('madnetjs')

export const curveTypes = {
    SECP256K1: 1,
    BARRETO_NAEHRIG: 2,
}

/**
 * Generate and return a new JSON blob representing the data for a keystore.
 * @param { Boolean } asBlob - Return keystore as a blob?
 * @param { String } password - Password to secure the keystore with
 * @param { CurveType } curve - Curve if desired, default to type 1
 * @returns { Blob || JSON String } - JSON Blob || Json String
 */
export async function generateKeystore(asBlob, password, curve = curveTypes.SECP256K1) {
    let web3 = new Web3();
    let wallet = web3.eth.accounts.wallet.create(1);
    web3.eth.accounts.wallet.add(wallet[0]);
    let ks = web3.eth.accounts.wallet.encrypt(password);
    let keystore = ks[0];
    // Note the curve && address if BN -- Curve gets removed on reads
    if (curve === curveTypes.BARRETO_NAEHRIG) {
        keystore["address"] = await getBNfromPrivKey(strip0x(wallet[0].privateKey));
        keystore["curve"] = curveTypes.BARRETO_NAEHRIG;
    }
    let ksJSONBlob = new Blob([JSON.stringify(keystore, null, 2)]);
    return asBlob ? ksJSONBlob : keystore;
}

/**
 * Strip 0x prefix from eth bases addresses and keys
 * @param { String } pKeyOrAddress
 */
export const strip0x = (pKeyOrAddress) => {
    if (typeof pKeyOrAddress !== "string") {
        throw new Error("Only strings should be passed to strip0x(), handle this externally.");
    }
    // Only proceed if has prefix
    if (pKeyOrAddress[0] === "0" && pKeyOrAddress[1] === "x") {
        return pKeyOrAddress.slice(2, pKeyOrAddress.length);
    }
    return pKeyOrAddress;
}

/**
 * Return the barreto-naehrig derived public key for a given private key
 * @returns {Promise<String>} - barreto-naehrig derived public key string
 */
export async function getBNfromPrivKey(privK) {
    let walletInstance = new MadNetWalletJS();
    await walletInstance.Account.addAccount(privK, curveTypes.BARRETO_NAEHRIG);
    return walletInstance.Account.accounts[0].address;
}

/**
 * Generated a keystore object from a privateKey
 * @param {*} privK
 * @param {*} password
 * @param {*} curve
 * @param {*} asBlob
 */
export async function generateKeystoreFromPrivK(privK, password, curve = curveTypes.SECP256K1, asBlob) {
    let web3 = new Web3();
    web3.eth.accounts.wallet.add(privK);
    let ks = web3.eth.accounts.wallet.encrypt(password);
    let keystore = ks[0];
    // Note the curve && address if BN -- Curve gets removed on reads
    if (curve === curveTypes.BARRETO_NAEHRIG) {
        keystore["address"] = await getBNfromPrivKey(privK);
        keystore["curve"] = curveTypes.BARRETO_NAEHRIG;
    }
    let ksJSONBlob = new Blob([JSON.stringify(keystore, null, 2)]);
    return asBlob ? ksJSONBlob : keystore;
}