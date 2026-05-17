// routers/progressRouter.js
const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/progressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// 마이페이지
router.get('/mypage',                          ctrl.getMypage);
router.post('/attendance',                     ctrl.checkAttendance);

// 오답
router.get('/quiz/wrong',                      ctrl.getWrongIds);

// 북마크
router.post('/quiz/bookmark/toggle',           ctrl.toggleBookmark);
router.get('/mypage/bookmarkDetail/vc/:id',    ctrl.getVcBookmarkDetail);
router.get('/mypage/bookmarkDetail/word/:id',  ctrl.getWordBookmarkDetail);

// 게임
router.post('/game/record',                    ctrl.createRecord);
router.get('/game/top3',                       ctrl.getTop3Records);
router.get('/game/my-best-score',              ctrl.getUserTopScore);

module.exports = router;
