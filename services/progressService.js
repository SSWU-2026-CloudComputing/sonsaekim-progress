// services/progressService.js
require('dotenv').config();
const { Op, Sequelize } = require('sequelize');
const {
    VcWrong, WordWrong,
    BookmarkVc, BookmarkWord,
    GameRecord, Attendance, LearningStat,
} = require('../models');
const userClient     = require('../lib/userServiceClient');
const learningClient = require('../lib/learningServiceClient');

// ── 날짜 유틸 ────────────────────────────────────────────
const getKoreanDateString = (date = new Date()) => {
    const koreaOffset = 9 * 60 * 60 * 1000;
    return new Date(date.getTime() + koreaOffset).toISOString().slice(0, 10);
};

// ── 레벨 계산 (Progress 단독 소유) ──────────────────────
const calcLevel = (totalDays) => Math.floor(totalDays / 7) + 1;


// ══════════════════════════════════════════════════════════
// 오답 저장 ← quizService.saveQuizResults 에서 가져옴
// ══════════════════════════════════════════════════════════
exports.saveQuizResults = async (userId, quizResults) => {
    for (const result of quizResults) {
        const common = {
            is_follow:    result.is_follow    ?? false,
            is_relearned: result.is_relearned ?? false,
            created_at:   new Date(),
        };

        if (result.source_type === 'sign_word') {
            const where = { user_id: userId, word_id: result.source_id };
            const existing = await WordWrong.findOne({ where });
            if (existing) {
                if (existing.is_relearned !== common.is_relearned ||
                    existing.is_follow    !== common.is_follow) {
                    await WordWrong.update(common, { where });
                }
            } else {
                await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common });
            }

        } else if (result.source_type === 'sign_vc') {
            const where = { user_id: userId, vc_id: result.source_id };
            const existing = await VcWrong.findOne({ where });
            if (existing) {
                if (existing.is_relearned !== common.is_relearned ||
                    existing.is_follow    !== common.is_follow) {
                    await VcWrong.update(common, { where });
                }
            } else {
                await VcWrong.create({ user_id: userId, vc_id: result.source_id, ...common });
            }
        }
    }
};


// ══════════════════════════════════════════════════════════
// 오답 ID 목록 반환 ← quizService.getWrongAnswers 에서 ID 부분만
// (이미지 조회는 Learning 팀 API 호출로 대체)
// ══════════════════════════════════════════════════════════
exports.getWrongIds = async (userId) => {
    const [vcWrongs, wordWrongs] = await Promise.all([
        VcWrong.findAll({
            where: { user_id: userId, is_relearned: false },
            attributes: ['vc_id'],
        }),
        WordWrong.findAll({
            where: { user_id: userId, is_relearned: false },
            attributes: ['word_id'],
        }),
    ]);

    return {
        vcIds:   vcWrongs.map(v => v.vc_id),
        wordIds: wordWrongs.map(w => w.word_id),
    };
};


// ══════════════════════════════════════════════════════════
// 북마크 토글 ← quizService.toggleBookmark 에서 가져옴
// ══════════════════════════════════════════════════════════
exports.toggleBookmark = async (userId, sourceType, sourceId) => {
    if (sourceType === 'sign_word') {
        const existing = await BookmarkWord.findOne({
            where: { user_id: userId, word_id: sourceId },
        });
        if (existing) {
            await BookmarkWord.destroy({ where: { user_id: userId, word_id: sourceId } });
            return 'removed';
        } else {
            await BookmarkWord.create({ user_id: userId, word_id: sourceId });
            return 'added';
        }

    } else if (sourceType === 'sign_vc') {
        const existing = await BookmarkVc.findOne({
            where: { user_id: userId, vc_id: sourceId },
        });
        if (existing) {
            await BookmarkVc.destroy({ where: { user_id: userId, vc_id: sourceId } });
            return 'removed';
        } else {
            await BookmarkVc.create({ user_id: userId, vc_id: sourceId });
            return 'added';
        }
    } else {
        throw new Error('유효하지 않은 sourceType입니다.');
    }
};


// ══════════════════════════════════════════════════════════
// 게임 기록 ← gameService 에서 가져옴
// ══════════════════════════════════════════════════════════
exports.createRecord = async (userId, score, userName) => {
    return await GameRecord.create({ user_id: userId, score, user_name: userName });
};

exports.getTop3Records = async () => {
    // User JOIN 제거 — user_name 컬럼 직접 사용
    return await GameRecord.findAll({
        order: [['score', 'DESC']],
        limit: 3,
        attributes: ['game_record_id', 'user_id', 'user_name', 'score'],
    });
};

exports.getAllRecords = async () => {
    return await GameRecord.findAll();
};

exports.getUserTopScore = async (userId) => {
    return await GameRecord.max('score', { where: { user_id: userId } });
};


// ══════════════════════════════════════════════════════════
// 마이페이지 집계 ← mypageService.renderMypage 에서 가져옴
// User.findOne() → userServiceClient 호출로 교체
// ══════════════════════════════════════════════════════════
exports.getMypage = async (userId) => {
    // 기존: const user = await User.findOne(...)
    // 전환: User Service API 호출
    const user = await userClient.getUserById(userId);

    const today     = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 27);

    const attendanceList = await Attendance.findAll({
        where: {
            user_id: userId,
            date: { [Op.gte]: startDate },
        },
        order: [['date', 'ASC']],
    });

    const attendanceDates = attendanceList.map(a => a.date);
    const attendanceSet   = new Set(
        attendanceDates.map(d => getKoreanDateString(new Date(d)))
    );

    let continuous = 0;
    const todayStr = getKoreanDateString();
    if (attendanceSet.has(todayStr)) {
        continuous = 1;
        for (let i = 1; i <= 27; i++) {
            const dStr = getKoreanDateString(new Date(Date.now() - i * 86400000));
            if (attendanceSet.has(dStr)) continuous++;
            else break;
        }
    }

    const totalDays       = attendanceList.length;
    const calculatedLevel = calcLevel(totalDays);

    let stat = await LearningStat.findOne({ where: { user_id: userId } });
    if (!stat) {
        stat = await LearningStat.create({
            user_id:           userId,
            total_study_count: totalDays,
            level:             calculatedLevel,
            continuous_days:   continuous,
        });
    } else if (
        stat.level             !== calculatedLevel ||
        stat.total_study_count !== totalDays       ||
        stat.continuous_days   !== continuous
    ) {
        stat.set({
            level:             calculatedLevel,
            total_study_count: totalDays,
            continuous_days:   continuous,
        });
        await stat.save();
    }

    const [vcBookmarksRaw, wordBookmarksRaw] = await Promise.all([
        BookmarkVc.findAll({ where: { user_id: userId } }),
        BookmarkWord.findAll({ where: { user_id: userId } }),
    ]);

    return {
        name:            user.name,
        email:           user.email,
        favorite:        user.favorite_study,
        level:           stat.level,
        totalDays,
        daysToNextLevel: 7 - (totalDays % 7),
        continuousDays:  continuous,
        attendanceDates,
        vcBookmarkIds:   vcBookmarksRaw.map(b => b.vc_id),
        wordBookmarkIds: wordBookmarksRaw.map(b => b.word_id),
    };
};


// ══════════════════════════════════════════════════════════
// 북마크 상세 ← mypageService.renderVcDetail / renderWordDetail 에서 가져옴
// SignVc.findOne() → learningServiceClient 호출로 교체
// ══════════════════════════════════════════════════════════
exports.getVcBookmarkDetail = async (userId, vcId) => {
    const [vcDetail, bookmark] = await Promise.all([
        learningClient.getSignVcById(vcId),  // 기존: SignVc.findOne(...)
        BookmarkVc.findOne({ where: { user_id: userId, vc_id: vcId } }),
    ]);

    return {
        image:       vcDetail.image,
        description: vcDetail.description,
        isBookmarked: !!bookmark,
        sourceId:    vcId,
        sourceType:  'sign_vc',
    };
};

exports.getWordBookmarkDetail = async (userId, wordId) => {
    const [wordDetail, bookmark] = await Promise.all([
        learningClient.getSignWordById(wordId),  // 기존: SignWord.findOne(...)
        BookmarkWord.findOne({ where: { user_id: userId, word_id: wordId } }),
    ]);

    return {
        image:       wordDetail.image,
        description: wordDetail.description,
        isBookmarked: !!bookmark,
        sourceId:    wordId,
        sourceType:  'sign_word',
    };
};


// ══════════════════════════════════════════════════════════
// 출석 체크
// ══════════════════════════════════════════════════════════
exports.checkAttendance = async (userId) => {
    const todayStr = getKoreanDateString();
    const existing = await Attendance.findOne({
        where: { user_id: userId, date: todayStr },
    });
    if (!existing) {
        await Attendance.create({ user_id: userId, date: todayStr });
    }
};


// ══════════════════════════════════════════════════════════
// 신규 사용자 집계 row 초기화 (UserSignedUp 이벤트 소비)
// ══════════════════════════════════════════════════════════
exports.initUserProgress = async (userId) => {
    const existing = await LearningStat.findOne({ where: { user_id: userId } });
    if (!existing) {
        await LearningStat.create({
            user_id:           userId,
            total_study_count: 0,
            level:             1,
            continuous_days:   0,
        });
    }
};
