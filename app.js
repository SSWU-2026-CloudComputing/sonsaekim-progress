require('dotenv').config();
const express = require('express');
const { connect } = require('./configs/rabbitmq');
const { sequelize } = require('./models');
const progressRouter = require('./routers/progressRouter');
const PORT = process.env.PORT || 3002;
const quizSubmittedConsumer      = require('./consumers/quizSubmittedConsumer');
const gamePlayedConsumer         = require('./consumers/gamePlayedConsumer');
const userSignedUpConsumer       = require('./consumers/userSignedUpConsumer');
const inferenceCompletedConsumer = require('./consumers/inferenceCompletedConsumer');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/progress', progressRouter);

const validateEnv = () => {
    const required = [
        'PORT',
        'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
        'RABBITMQ_URL',
        'AUTH_SERVICE_URL',
        'LEARNING_SERVICE_URL',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('필수 환경변수 누락:', missing.join(', '));
        process.exit(1);
    }

    console.log('환경변수 검증 완료');
};

const start = async () => {
    validateEnv();  
   try { 
	// 1. DB 연결 확인
        await sequelize.sync();
        console.log('Progress DB 연결 완료');

        // 2. RabbitMQ 연결
        await connect();

        // 3. Consumer 시작
        await quizSubmittedConsumer.start();
        await gamePlayedConsumer.start();
        await userSignedUpConsumer.start();
        await inferenceCompletedConsumer.start();

        // 4. 서버 시작
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Progress Service running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Progress Service 시작 실패:', err);
        process.exit(1);
    }
};

start();
