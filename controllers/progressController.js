// controllers/progressController.js
const progressService = require('../services/progressService');

exports.getMypage = async (req, res) => {
    try {
        const data = await progressService.getMypage(req.userId);
        res.json(data);
    } catch (err) {
        console.error('getMypage 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getWrongIds = async (req, res) => {
    try {
        const data = await progressService.getWrongIds(req.userId);
        res.json(data);
    } catch (err) {
        console.error('getWrongIds 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

// ── 기존 toggleBookmark 3개로 분리 ──────────

// GET /progress/bookmarks?userId=&sourceType=
// (userId는 쿼리로도 받지만 헤더 x-user-id 우선)
exports.getBookmarks = async (req, res) => {
    try {
        const userId     = req.userId;
        const sourceType = req.query.sourceType; // 'sign_vc' | 'sign_word'
        const data = await progressService.getBookmarks(userId, sourceType);
        res.json(data);
    } catch (err) {
        console.error('getBookmarks 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

// POST /progress/bookmarks
// body: { sourceType, sourceId }
exports.addBookmark = async (req, res) => {
    try {
        const userId     = req.userId;
        const { sourceType, sourceId } = req.body;
        await progressService.addBookmark(userId, sourceType, sourceId);
        res.json({ message: '북마크 추가 완료' });
    } catch (err) {
        if (err.message === 'ALREADY_BOOKMARKED') {
    	    return res.status(409).json({ message: '이미 북마크된 항목입니다.' });
    	}
	console.error('addBookmark 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

// DELETE /progress/bookmarks
// body: { sourceType, sourceId }
exports.removeBookmark = async (req, res) => {
    try {
        const userId     = req.userId;
        const { sourceType, sourceId } = req.body;
        await progressService.removeBookmark(userId, sourceType, sourceId);
        res.json({ message: '북마크 삭제 완료' });
    } catch (err) {
        if (err.message === 'BOOKMARK_NOT_FOUND') {
            return res.status(404).json({ message: '북마크를 찾을 수 없습니다.' });
        }
	console.error('removeBookmark 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getVcBookmarkDetail = async (req, res) => {
    try {
        const data = await progressService.getVcBookmarkDetail(req.userId, req.params.id);
        res.json(data);
    } catch (err) {
        console.error('getVcBookmarkDetail 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getWordBookmarkDetail = async (req, res) => {
    try {
        const data = await progressService.getWordBookmarkDetail(req.userId, req.params.id);
        res.json(data);
    } catch (err) {
        console.error('getWordBookmarkDetail 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.createRecord = async (req, res) => {
    try {
        const { score, userName } = req.body;
        await progressService.createRecord(req.userId, score, userName);
        res.json({ message: '기록 저장 완료' });
    } catch (err) {
        console.error('createRecord 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getAllGameRecords = async (req, res) => {
    try {
        const records = await gameService.getAllRecords();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: '기록 가져오기 실패' });
    }
};

exports.getTop3Records = async (req, res) => {
    try {
        const data = await progressService.getTop3Records();
        res.json(data);
    } catch (err) {
        console.error('getTop3Records 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.getUserTopScore = async (req, res) => {
    try {
        const score = await progressService.getUserTopScore(req.userId);
        res.json({ score });
    } catch (err) {
        console.error('getUserTopScore 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.checkAttendance = async (req, res) => {
    try {
        await progressService.checkAttendance(req.userId);
        res.json({ message: '출석 완료' });
    } catch (err) {
        console.error('checkAttendance 오류:', err);
        res.status(500).json({ message: '서버 오류' });
    }
};
