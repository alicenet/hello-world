const axios = require('axios');
const root = "http://catmad.duckdns.org:20002"

const get = async (path) => {
    try {
        let res = await axios.get(root + path)
        return res.data;
    } catch (ex) {
        return { error: ex }
    }
}

export const fundAddress = async address => { return await get('/fund/' + address) };