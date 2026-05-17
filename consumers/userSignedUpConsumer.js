// consumers/userSignedUpConsumer.js
const { getChannel }  = require('../configs/rabbitmq');
const progressService = require('../services/progressService');

const start = async () => {
    const ch = getChannel();
    await ch.assertQueue('user.signed-up', { durable: true });

    ch.consume('user.signed-up', async (msg) => {
        try {
            const { userId } = JSON.parse(msg.content.toString());
            await progressService.initUserProgress(userId);
            ch.ack(msg);
            console.log(`[user.signed-up] userId=${userId} 초기화 완료`);
        } catch (err) {
            console.error('[user.signed-up] 처리 오류:', err);
            ch.nack(msg, false, true);
        }
    });

    console.log('[Consumer] user.signed-up 구독 시작');
};

module.exports = { start };
