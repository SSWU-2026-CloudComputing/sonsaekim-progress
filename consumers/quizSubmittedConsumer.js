// consumers/quizSubmittedConsumer.js
const { getChannel }  = require('../configs/rabbitmq');
const progressService = require('../services/progressService');

const start = async () => {
    const ch = getChannel();

    // Learning 팀 setup.js에서 이미 만든 Queue 그대로 사용
    await ch.assertQueue('quiz.submitted', { durable: true });
    await ch.bindQueue('quiz.submitted', 'learning.events', 'quiz.submitted');

    ch.consume('quiz.submitted', async (msg) => {
        if (!msg) return;
        try {
            const { userId, quizResults } = JSON.parse(msg.content.toString());
            await progressService.saveQuizResults(userId, quizResults);
            ch.ack(msg);
            console.log(`[quiz.submitted] userId=${userId} 오답 저장 완료`);
        } catch (err) {
            console.error('[quiz.submitted] 처리 오류:', err);
            ch.nack(msg, false, true);
        }
    });

    console.log('[Consumer] quiz.submitted 구독 시작');
};

module.exports = { start };
