const axios = require('axios');

const LEARNING_URL = process.env.LEARNING_SERVICE_URL;

const getSignVcById = async (vcId) => {
    const res = await axios.get(`${LEARNING_URL}/contents/vc/${vcId}`);
    return res.data;
};

const getSignWordById = async (wordId) => {
    const res = await axios.get(`${LEARNING_URL}/contents/word/${wordId}`);
    return res.data;
};

module.exports = { getSignVcById, getSignWordById };
