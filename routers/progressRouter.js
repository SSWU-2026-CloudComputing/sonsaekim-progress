// routers/progressRouter.js
const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/progressController');

// ── 북마크 ────────────────────────────────────────
// GET  /progress/bookmarks?userId=&sourceType=
router.get('/bookmarks',    ctrl.getBookmarks);

// POST /progress/bookmarks
router.post('/bookmarks',   ctrl.addBookmark);

// DELETE /progress/bookmarks
router.delete('/bookmarks', ctrl.removeBookmark);

// ── 오답 ──────────────────────────────────────────
// GET /progress/wrong-answers?userId=
router.get('/wrong-answers', ctrl.getWrongIds);

// ── 랭킹 ──────────────────────────────────────────
// GET /progress/ranking/top3
router.get('/ranking/top3',  ctrl.getTop3Records);

// GET /progress/ranking/all
router.get('/ranking/all',   ctrl.getAllGameRecords);

// ── 점수 ──────────────────────────────────────────
// GET /progress/score/best?userId=
router.get('/score/best',    ctrl.getUserTopScore);

// ──마이페이지, 출석, 게임기록 저장 ────────────────
router.get('/mypage',                          ctrl.getMypage);
router.post('/attendance',                     ctrl.checkAttendance);
router.post('/game/record',                    ctrl.createRecord);
router.get('/mypage/bookmarkDetail/vc/:id',    ctrl.getVcBookmarkDetail);
router.get('/mypage/bookmarkDetail/word/:id',  ctrl.getWordBookmarkDetail);

module.exports = router;
