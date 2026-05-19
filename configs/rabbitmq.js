// configs/rabbitmq.js
const amqp = require('amqplib');

let connection = null;
let channel    = null;

const RETRY_INTERVAL = 5000; // 5초마다 재시도

const connect = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel    = await connection.createChannel();

        console.log('✅ RabbitMQ 연결 완료');

        // 연결 끊기면 일정 시간 후 재연결 시도
        connection.on('close', () => {
            console.warn('⚠️ RabbitMQ 연결 끊김 — 재연결 시도 중...');
            channel = null;
            setTimeout(connect, RETRY_INTERVAL);
        });

        connection.on('error', (err) => {
            console.error('RabbitMQ 오류:', err.message);
        });

        return channel;

    } catch (err) {
        console.error('RabbitMQ 연결 실패 — 재시도:', err.message);
        setTimeout(connect, RETRY_INTERVAL);
    }
};

const getChannel = () => {
    if (!channel) throw new Error('RabbitMQ 채널이 아직 준비되지 않았습니다.');
    return channel;
};

module.exports = { connect, getChannel };
