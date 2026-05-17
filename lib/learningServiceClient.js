// lib/learningServiceClient.js
const axios = require('axios');

const BASE = process.env.LEARNING_SERVICE_URL;
/*
const getSignVcById = async (vcId) => {
    const res = await axios.get(`${BASE}/api/sign-vc/${vcId}`);
    return res.data;
};

const getSignWordById = async (wordId) => {
    const res = await axios.get(`${BASE}/api/sign-word/${wordId}`);
    return res.data;
};

module.exports = { getSignVcById, getSignWordById };
*/

// lib/learningServiceClient.js 임시 mock
const getSignVcById = async (vcId) => {
    return {
        vc_id:       vcId,
        image:       '/assets/sign1.svg', // 임시 이미지
        description: `VC ${vcId}`,
    };
};

const getSignWordById = async (wordId) => {
    return {
        word_id:     wordId,
        image:       '/assets/sign1.svg', // 임시 이미지
        description: `Word ${wordId}`,
    };
};

module.exports = { getSignVcById, getSignWordById };
