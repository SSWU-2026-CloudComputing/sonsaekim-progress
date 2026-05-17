// sync.js
require('dotenv').config();
const { sequelize } = require('./models');

sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ DB 테이블 생성 완료');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ DB 동기화 실패:', err);
        process.exit(1);
    });
