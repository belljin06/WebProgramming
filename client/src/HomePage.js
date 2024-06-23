// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'http://localhost:4000/api'

const HomePage = () => {
  const [text, setText] = useState('');
  const [member_id, setMember_id] = useState(''); // Add state for campId
  const navigate = useNavigate();

  const sendRequest = async() => {
    const response = await axios.get(apiUrl)
    setText(response.data.hello);
  }

  useEffect(() => {
    sendRequest();
  }, []);

  const handleRegisterClick = () => {
    navigate(`/register-campsite-info/${member_id}`); // Modify to include campId in URL
  }

  const handleEditClick = () => {
    navigate(`/edit-campsite-info/${member_id}`); // Include member_id in the URL
  };

  const handleSiteClick = () => {
    navigate(`/reservation-management/${member_id}`); //예약 관리 페이지로 이동하면서 member_id 값을 URL에 포함
  }

  return (
    <div>
      <h1>{text}</h1>
      <input type="text" placeholder="로그인 아이디 입력" value={member_id} onChange={(e) => setMember_id(e.target.value)} />
      <button onClick={handleRegisterClick}>캠핑장 정보 등록</button>
      <button onClick={handleEditClick}>캠핑장 정보 수정</button>
      <button onClick={handleSiteClick}>예약 관리</button>
    </div>
  );
};

export default HomePage;

