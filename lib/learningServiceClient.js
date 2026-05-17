// lib/learningServiceClient.js
const axios = require('axios');

const BASE = process.env.LEARNING_SERVICE_URL;

const getSignVcById = async (vcId) => {
    const res = await axios.get(`${BASE}/api/sign-vc/${vcId}`);
    return res.data;
};

const getSignWordById = async (wordId) => {
    const res = await axios.get(`${BASE}/api/sign-word/${wordId}`);
    return res.data;
};

module.exports = { getSignVcById, getSignWordById };
