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

exports.getBookmarks = async (req, res) => {
    try {
        const { userId, sourceType } = req.query;
    
        if (!userId || !sourceType) {
            return res.status(400).json({
            message: 'userId와 sourceType이 필요합니다.'
            });
        }

        const bookmarks = await progressService.getBookmarks(
            userId,
            sourceType
        );
    
        res.json(bookmarks);
    } catch (err) {
        console.error('getBookmarks 오류:', err);

        res.status(500).json({
            message: '서버 오류'
        });
    }
};

exports.toggleBookmark = async (req, res) => {
    try {
        const { userId, sourceType, sourceId } = req.body;
        
        if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
        }
        
        const status = await progressService.toggleBookmark(
            userId,
            sourceType,
            sourceId
        );
    
        res.json({ status });
    } catch (err) {
        console.error('toggleBookmark 오류:', err);
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
