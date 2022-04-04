const axios = require('axios');

export const get = async (path) => {
    try {
        let res = await axios.get(path)
        return res.data;
    } catch (ex) {
        return { error: ex }
    }
}