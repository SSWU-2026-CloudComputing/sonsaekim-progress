const axios = require('axios');

const BASE = process.env.AUTH_SERVICE_URL;

const getUserById = async (userId) => {
    const res = await axios.get(`${BASE}/api/users/${userId}`);
    return res.data;
};

module.exports = { getUserById };
