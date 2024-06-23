const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'reactexpress'
});

// MySQL 연결
db.connect(err => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err);
  } else {
    console.log('데이터베이스에 성공적으로 연결되었습니다.');
  }
});

module.exports = db;
