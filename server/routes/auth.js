const express = require("express");
const router = express.Router();

// 로그인 상태 확인
router.get("/check-login-status", function (req, res) {
  if (req.session.user) {
    res.json({ isLoggedIn: true, member_id: req.session.user.member_id });
  } else {
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
