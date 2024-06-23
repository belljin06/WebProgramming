const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 마이페이지에서 예약 정보를 가져오는 엔드포인트
router.get("/mypage/:member_id", function (req, res) {
  const memberId = req.params.member_id;

  const query = `
    SELECT r.reserve_id, r.reserve_checkin, r.reserve_checkout, r.reserve_adult, r.reserve_child, r.reserve_status,
           cs.site_name, cs.site_intro, cs.cost, cs.site_url, cs.site_max_guests,
           c.camp_name, c.camp_address, c.camp_phone, c.camp_intro, c.camp_url, c.camp_checkin, c.camp_checkout, c.camp_manner_time, c.camp_amenities
    FROM reserve r
    JOIN camp_site cs ON r.site_id = cs.site_id
    JOIN camp c ON cs.camp_id = c.camp_id
    WHERE r.member_id = ?
  `;

  db.query(query, [memberId], (err, results) => {
    if (err) {
      console.error('쿼리 실행 오류:', err);
      res.status(500).send('서버 오류');
    } else {
      console.log('쿼리 결과:', results); // 쿼리 결과를 로그로 출력
      res.json(results);
    }
  });
});

module.exports = router;
