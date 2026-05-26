// lib/userServiceClient.js
const axios = require('axios');

const BASE = process.env.AUTH_SERVICE_URL;

const getUserById = async (userId) => {
    // TODO: User 팀 API 완성 후 실제 호출로 교체
    return {
        user_id:        userId,
        name:           '테스트유저',
        email:          'test@test.com',
        favorite_study: null,
    };
//    const res = await axios.get(`${BASE}/api/users/${userId}`);
//    return res.data;
};

module.exports = { getUserById };
