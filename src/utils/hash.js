import ethers from 'ethers';

/**
 * Return keccak256 hash of an input
 * @param { String } - String to return as a keccak256 hash
 */
export function keccak256(input) {
    return ethers.utils.keccak256(input);
}