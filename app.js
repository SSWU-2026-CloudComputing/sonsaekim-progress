// app.js
require('dotenv').config();
const express = require('express');
const { connect } = require('./configs/rabbitmq');
const { sequelize } = require('./models');
const progressRouter = require('./routers/progressRouter');

const quizSubmittedConsumer      = require('./consumers/quizSubmittedConsumer');
const gamePlayedConsumer         = require('./consumers/gamePlayedConsumer');
const userSignedUpConsumer       = require('./consumers/userSignedUpConsumer');
const inferenceCompletedConsumer = require('./consumers/inferenceCompletedConsumer');

const app = express();
app.use(express.json());

// 헬스체크 (Kubernetes Liveness Probe용)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', progressRouter);

const start = async () => {
    try {
        // 1. DB 연결 확인
        await sequelize.authenticate();
        console.log('✅ Progress DB 연결 완료');

        // 2. RabbitMQ 연결
        await connect();

        // 3. Consumer 시작
        await quizSubmittedConsumer.start();
        await gamePlayedConsumer.start();
        await userSignedUpConsumer.start();
        await inferenceCompletedConsumer.start();

        // 4. 서버 시작
        app.listen(process.env.PORT || 3003, () => {
            console.log(`✅ Progress Service 실행 중 — port ${process.env.PORT || 3003}`);
        });

    } catch (err) {
        console.error('❌ Progress Service 시작 실패:', err);
        process.exit(1);
    }
};

start();
