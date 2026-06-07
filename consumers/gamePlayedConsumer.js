const { getChannel }  = require('../configs/rabbitmq');
const progressService = require('../services/progressService');

const start = async () => {
    const ch = getChannel();


    await ch.assertQueue('game-played-queue', { durable: true });
    await ch.bindQueue('game-played-queue', 'learning.events', 'game.played');

    ch.consume('game-played-queue', async (msg) => {
        if (!msg) return;
        try {
            const { userId, userName, score } = JSON.parse(msg.content.toString());
            await progressService.createRecord(userId, score, userName);
            ch.ack(msg);
            console.log(`[game-played-queue] userId=${userId} score=${score} 기록 저장 완료`);
        } catch (err) {
            console.error('[game-played-queue] 처리 오류:', err);
            ch.nack(msg, false, false);
        }
    });

    console.log('[Consumer] game-played-queue 구독 시작');
};

module.exports = { start };
