const { getChannel } = require('../configs/rabbitmq');

const start = async () => {
    const ch = getChannel();
    await ch.assertQueue('inference.completed', { durable: true });

    ch.consume('inference.completed', async (msg) => {
        try {
            const payload = JSON.parse(msg.content.toString());
            console.log('[inference.completed] 수신:', payload);
            ch.ack(msg);
        } catch (err) {
            console.error('[inference.completed] 처리 오류:', err);
            ch.nack(msg, false, true);
        }
    });

    console.log('[Consumer] inference.completed 구독 시작');
};

module.exports = { start };
