// consumers/userSignedUpConsumer.js
const { getChannel }  = require('../configs/rabbitmq');
const progressService = require('../services/progressService');

const start = async () => {
    const ch = getChannel();

    // auth.events Exchange 선언 (Auth 팀과 동일)
    await ch.assertExchange('auth.events', 'topic', { durable: true });

    // Queue 생성 후 Exchange에 바인딩
    const q = await ch.assertQueue('progress.user.signed-up', { durable: true });
    await ch.bindQueue(q.queue, 'auth.events', 'user.signed-up');

    ch.consume(q.queue, async (msg) => {
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
