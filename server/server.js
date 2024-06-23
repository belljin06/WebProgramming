const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const memorystore = require("memorystore");
const MemoryStore = memorystore(session);
const db = require("./db/db"); // 데이터베이스 설정 불러오기
const loginRouter = require("./routes/login");
const authRouter = require("./routes/auth");
const mypageRouter = require("./routes/mypage"); // 마이페이지 라우터 추가

const app = express();
const PORT = 4000;

const maxAge = 1000 * 60 * 5; // Specifies the number (in milliseconds)

const sessionObj = {
  secret: "se",
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: maxAge }),
  cookie: {
    maxAge: maxAge,
  },
};
const mySession = session(sessionObj);

app.use(mySession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/", loginRouter);
app.use("/api", authRouter);
app.use("/api", mypageRouter);

app.get("/api", (req, res) => {
  res.send({ hello: "hello" });
});

app.get("/api/camps", (req, res) => {
  const { campName, checkin, checkout, region, type } = req.query;

  let query = `
    SELECT c.*
    FROM camp c
    WHERE 1=1
  `;
  if (campName) {
    query += ` AND c.camp_name LIKE '%${campName}%'`;
  }
  if (region) {
    query += ` AND c.camp_region LIKE '%${region}%'`;
  }
  if (type) {
    query += ` AND c.camp_type = ${type}`;
  }

  if (checkin && checkout) {
    query += `
      AND EXISTS (
        SELECT 1
        FROM camp_site s
        LEFT JOIN reserve r ON s.site_id = r.site_id
        WHERE s.camp_id = c.camp_id
          AND (
            r.reserve_status = 1 OR r.reserve_status IS NULL
          )
          AND (
            (r.reserve_checkin IS NULL OR r.reserve_checkout IS NULL) OR
            (r.reserve_checkin > '${checkout}' OR r.reserve_checkout < '${checkin}')
          )
      )
    `;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error("쿼리 실행 오류:", err);
      res.status(500).send("서버 오류");
    } else {
      res.json(results);
    }
  });
});

app.get("/api/camps/:id", (req, res) => {
  const campId = req.params.id;
  const { checkin, checkout } = req.query;

  const campQuery = "SELECT * FROM camp WHERE camp_id = ?";

  let siteQuery = "";
  let queryParams = [];

  if (checkin && checkout) {
    siteQuery = `
      SELECT s.*, 
        COALESCE(r.reserve_status, 1) AS reserve_status
      FROM camp_site s
      LEFT JOIN reserve r ON s.site_id = r.site_id
        AND (
          (r.reserve_checkin <= ? AND r.reserve_checkout > ?)
          OR (r.reserve_checkin < ? AND r.reserve_checkout >= ?)
          OR (r.reserve_checkin >= ? AND r.reserve_checkout <= ?)
        )
      WHERE s.camp_id = ?
    `;
    queryParams = [
      checkin,
      checkin,
      checkout,
      checkout,
      checkin,
      checkout,
      campId,
    ];
  } else {
    siteQuery = `
      SELECT s.*, 
        1 AS reserve_status
      FROM camp_site s
      WHERE s.camp_id = ?
    `;
    queryParams = [campId];
  }

  const reviewQuery = `
    SELECT r.*
    FROM review r
    JOIN reserve re ON r.reserve_id = re.reserve_id
    JOIN camp_site s ON re.site_id = s.site_id
    WHERE s.camp_id = ?
  `;

  db.query(campQuery, [campId], (err, campResults) => {
    if (err) {
      console.error("쿼리 실행 오류 (캠핑장 정보):", err);
      res.status(500).send("서버 오류");
      return;
    }

    db.query(siteQuery, queryParams, (err, siteResults) => {
      if (err) {
        console.error("쿼리 실행 오류 (사이트 정보):", err);
        res.status(500).send("서버 오류");
        return;
      }

      db.query(reviewQuery, [campId], (err, reviewResults) => {
        if (err) {
          console.error("쿼리 실행 오류 (리뷰 정보):", err);
          res.status(500).send("서버 오류");
          return;
        }

        res.json({
          camp: campResults[0],
          sites: siteResults,
          reviews: reviewResults,
        });
      });
    });
  });
});

// 캠핑장 정보 등록을 위한 새로운 POST 경로
app.post("/api/insertData", (req, res) => {
  const {
    member_id,
    camp_name,
    camp_address,
    camp_region,
    camp_phone,
    camp_intro,
    camp_url,
    camp_checkin,
    camp_checkout,
    camp_type,
    camp_manner_time,
    camp_amenities,
  } = req.body;

  let sql = `INSERT INTO camp (
    member_id,
    camp_name,
    camp_address,
    camp_region,
    camp_phone,
    camp_intro,
    camp_url,
    camp_checkin,
    camp_checkout,
    camp_type,
    camp_manner_time,
    camp_amenities
  ) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?)`;

  let values = [
    member_id,
    camp_name,
    camp_address,
    camp_region,
    camp_phone,
    camp_intro,
    camp_url,
    camp_checkin,
    camp_checkout,
    camp_type,
    camp_manner_time,
    camp_amenities,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("데이터 삽입 실패");
    } else {
      console.log("데이터 성공적으로 삽입됨", result);
      res.status(200).send("데이터 성공적으로 삽입됨");
    }
  });
});

// 캠핑장 정보 수정을 위한 PUT 경로
// 캠핑장목록불러오기
app.get("/api/camping/:memberId", (req, res) => {
  const { memberId } = req.params;
  let sql = "SELECT * FROM camp WHERE member_id = ?;";
  db.query(sql, [memberId], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

//캠핑장수정
app.put("/api/updateData/:campId", (req, res) => {
  const { campId } = req.params;
  const {
    member_id,
    camp_name,
    camp_address,
    camp_phone,
    camp_intro,
    camp_url,
    camp_checkin,
    camp_checkout,
    camp_type,
    camp_manner_time,
    camp_amenities,
  } = req.body;

  let sql = `UPDATE camp SET
    
    camp_name = ?,
    camp_address = ?,
    camp_phone = ?,
    camp_intro = ?,
    camp_url = ?,
    camp_checkin = ?,
    camp_checkout = ?,
    camp_type = ?,
    camp_manner_time = ?,
    camp_amenities = ?

  WHERE camp_id = ?`;

  let values = [
    camp_name,
    camp_address,
    camp_phone,
    camp_intro,
    camp_url,
    camp_checkin,
    camp_checkout,
    camp_type,
    camp_manner_time,
    camp_amenities,
    campId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 업데이트 중 오류 발생:", err);
      res.status(500).send("데이터 업데이트 실패");
    } else {
      console.log("데이터 성공적으로 업데이트됨", result);
      res.status(200).send("데이터 성공적으로 업데이트됨");
    }
  });
});

//사이트 등록
//사이트 정보 등록을 위한 새로운 POST 경로
app.post("/api/insertCampSiteData", (req, res) => {
  const { camp_id, cost, site_url, site_max_guests, site_intro } = req.body;

  let sql = `INSERT INTO camp_site ( 
    camp_id,
    cost,
    site_url,
    site_max_guests,
    site_intro
  ) VALUES (?,?, ?, ?, ?)`;

  let values = [camp_id, cost, site_url, site_max_guests, site_intro];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터 삽입 중 오류 발생:", err);
      res.status(500).send("데이터 삽입 실패");
    } else {
      console.log("데이터 성공적으로 삽입됨", result);
      res.status(200).send("데이터 성공적으로 삽입됨");
    }
  });
});

//예약확정을 위한 예약 내역 불러오기
app.get("/api/reservations/confirmed/:member_id", (req, res) => {
  const member_id = req.params.member_id;
  const sql = `
    SELECT reserve.*, member.member_name, camp.camp_name
    FROM reserve
    INNER JOIN camp_site ON reserve.site_id = camp_site.site_id
    INNER JOIN camp ON camp_site.camp_id = camp.camp_id
    INNER JOIN member ON reserve.member_id = member.member_id
    WHERE camp.member_id = ?;
  `;

  db.query(sql, [member_id], (err, results) => {
    if (err) {
      console.error("서버예약 내역 조회 중 오류 발생:", err);
      res.status(500).send("예약 내역 조회 실패");
    } else {
      res.json(results);
    }
  });
});

//예약확정 상태변경
app.put("/api/reservations/update/:reserve_id", (req, res) => {
  const reserve_id = req.params.reserve_id;
  const { status } = req.body; // status 값을 요청 본문에서 추출
  const sql = `
    UPDATE reserve
    SET reserve_status = ?
    WHERE reserve_id = ?;
  `;

  db.query(sql, [status, reserve_id], (err, result) => {
    if (err) {
      console.error("예약 상태 변경 중 오류 발생:", err);
      res.status(500).send("예약 상태 변경 실패");
    } else {
      res.status(200).send("예약 상태 변경 성공");
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
