// configs/rabbitmq.js
const amqp = require('amqplib');
let channel;

const connect = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();

    conn.on('error', (err) => {
        console.error('RabbitMQ 연결 오류:', err);
        process.exit(1);
    });

    console.log('✅ RabbitMQ 연결 완료');
    return channel;
};

const getChannel = () => {
    if (!channel) throw new Error('RabbitMQ 채널이 초기화되지 않았습니다.');
    return channel;
};

module.exports = { connect, getChannel };
