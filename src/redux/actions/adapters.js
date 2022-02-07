import madNetAdapter from 'adapters/madAdapter';

/**
 * If madNetAdapter is not in a connected state attempt to connect
 * @param { Object } initConfig - Init config passthrough for the madNetAdapter __init function
 * @returns
 */
export const initMadNet = (initConfig) => {
    return async (dispatch, getState) => {
        let connected = await madNetAdapter.__init(initConfig);
        if (connected.error) {
            return { error: connected.error };
        }
        return true;
    }
}