const express = require("express");
const router = express.Router();
const db = require("../db/db"); // 데이터베이스 설정 불러오기

// 로그인 처리
router.post("/login", function (req, res) {
  const { login_id, login_pw } = req.body;

  console.log('로그인 시도:', login_id, login_pw); // 입력된 값을 로그로 출력

  // MySQL에서 로그인 정보 확인
  const query = 'SELECT * FROM member WHERE login_id = ? AND login_pw = ?';
  db.query(query, [login_id, login_pw], (err, results) => {
    if (err) {
      console.error('로그인 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    console.log('쿼리 결과:', results); // 쿼리 결과를 로그로 출력

    if (results.length > 0) {
      // 로그인 성공: 세션에 사용자 정보 저장
      req.session.user = results[0];
      res.cookie("username", results[0].member_name);
      res.json({ success: true, member_id: results[0].member_id });
    } else {
      // 로그인 실패
      console.log('로그인 실패: 잘못된 로그인 정보');
      res.status(401).json({ success: false, message: '로그인 실패: 잘못된 로그인 정보' });
    }
  });
});

// 로그아웃 처리
router.post("/logout", function (req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('로그아웃 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }

    res.clearCookie("username");
    res.json({ success: true }); // 로그아웃 성공 응답
  });
});

module.exports = router;
