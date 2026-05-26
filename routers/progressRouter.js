const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/progressController');

router.get('/bookmarks', ctrl.getBookmarks);

router.post('/bookmarks/toggle', ctrl.toggleBookmark);

router.get('/wrong-answers', ctrl.getWrongIds);

router.get('/ranking/top3',  ctrl.getTop3Records);

router.get('/ranking/all',   ctrl.getAllGameRecords);

router.get('/score/best',    ctrl.getUserTopScore);

router.get('/mypage',                          ctrl.getMypage);

router.post('/attendance',                     ctrl.checkAttendance);

router.post('/game/record',                    ctrl.createRecord);

router.get('/mypage/bookmarkDetail/vc/:id',    ctrl.getVcBookmarkDetail);

router.get('/mypage/bookmarkDetail/word/:id',  ctrl.getWordBookmarkDetail);

module.exports = router;
