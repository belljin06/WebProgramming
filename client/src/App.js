import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './HomePage';
import RegisterCampsiteInfo from './RegisterCampsiteInfo';
import EditCampsiteInfo from './EditCampsiteInfo';
import SiteRegistration from './SiteRegistration';
import ReservationManagement from './ReservationManagement';
import CampList from "./CampList";
import CampDetail from "./CampDetail";
import Login from "./Login";
import MyPage from "./MyPage"; // 마이페이지 컴포넌트 추가

const apiUrl = "http://localhost:4000/api";

const App = () => {
  const [text, setText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member_id, setMember_id] = useState('');

  const sendRequest = async () => {
    const response = await axios.get(apiUrl);
    setText(response.data.hello);
  };

  useEffect(() => {
    sendRequest();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/check-login-status`);
      setIsLoggedIn(response.data.isLoggedIn);
      if (response.data.isLoggedIn) {
        setMember_id(response.data.member_id);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CampList isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} member_id={member_id} />} />
        <Route path="/camp-list" element={<CampList isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} member_id={member_id} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setMember_id={setMember_id} />} />
        <Route path="/register-campsite-info/:member_id" element={<RegisterCampsiteInfo />} />
        <Route path="/edit-campsite-info/:member_id" element={<EditCampsiteInfo />} />
        <Route path="/register-campsite-site/:campId" element={<SiteRegistration />} />
        <Route path="/reservation-management/:member_id" element={<ReservationManagement />} />
        <Route path="/camp/:id" element={<CampDetail />} />
        <Route path="/mypage/:member_id" element={<MyPage />} /> {/* 마이페이지 경로 추가 */}
      </Routes>
    </Router>
  );
};

export default App;

// <Router>
//       <Routes>
//         <Route path="/*" element={<HomePage></HomePage>} />
//         <Route path="/register-campsite-info/:member_id" element={<RegisterCampsiteInfo/>}></Route> {/* Modify this line */}
//         <Route path="/edit-campsite-info/:member_id" element={<EditCampsiteInfo/>}></Route>
//         <Route path="/register-campsite-site/:campId" element={<SiteRegistration />} /> {/* 라우트 수정 */}
//         <Route path="/reservation-management/:member_id" element={<ReservationManagement />} />
//       </Routes>
//     </Router>
    