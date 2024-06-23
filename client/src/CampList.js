import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CampList.css'; // 스타일링을 위한 CSS 파일 추가

const apiUrl = 'http://localhost:4000/api';

const CampList = ({ isLoggedIn, setIsLoggedIn, member_id }) => {
  const [camps, setCamps] = useState([]);
  const [filters, setFilters] = useState({
    campName: '',
    checkin: '',
    checkout: '',
    region: '',
    type: ''
  });
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const fetchCamps = async (filters) => {
    try {
      const query = Object.entries(filters)
        .filter(([key, value]) => value) // 값이 있는 필터만 포함
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const response = await axios.get(`${apiUrl}/camps?${query}`);
      setCamps(response.data);
    } catch (error) {
      console.error("There was an error fetching the camps!", error);
    }
  };

  // Fetch initial data on component mount
  const sendRequest = async () => {
    const response = await axios.get(apiUrl);
    setText(response.data.hello);
  };

  useEffect(() => {
    fetchCamps({});
    sendRequest();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSearchClick = () => {
    fetchCamps(filters);
  };

  const handleResetClick = () => {
    setFilters({
      campName: '',
      checkin: '',
      checkout: '',
      region: '',
      type: ''
    });
    fetchCamps({});
  };

  const handleCampClick = (campId) => {
    navigate(`/camp/${campId}`);
  };

  const handleRegisterClick = () => {
    navigate(`/register-campsite-info/${member_id}`); // Include member_id in URL
  };

  const handleEditClick = () => {
    navigate(`/edit-campsite-info/${member_id}`); // Include member_id in the URL
  };

  const handleSiteClick = () => {
    navigate(`/reservation-management/${member_id}`); // 예약 관리 페이지로 이동하면서 member_id 값을 URL에 포함
  };

  const handleLoginClick = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  const handleLogoutClick = async () => {
    try {
      await axios.post('http://localhost:4000/logout'); // 로그아웃 API 엔드포인트
      setIsLoggedIn(false);
      navigate('/camp-list'); // 로그아웃 후 캠프 리스트 페이지로 이동
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const handleMyPageClick = () => {
    navigate(`/mypage/${member_id}`); // 마이페이지로 이동
  };

  return (
    <div>
      <h1>{text}</h1>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogoutClick}>Logout</button>
          <button onClick={handleMyPageClick}>My Page</button>
        </>
      ) : (
        <button onClick={handleLoginClick}>Login</button>
      )}
      {isLoggedIn && (
        <>
          <button onClick={handleRegisterClick}>캠핑장 정보 등록</button>
          <button onClick={handleEditClick}>캠핑장 정보 수정</button>
          <button onClick={handleSiteClick}>예약 관리</button>
        </>
      )}

      <h1>캠핑장 검색</h1>
      <input
        type="text"
        name="campName"
        placeholder="Enter camp name"
        value={filters.campName}
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="checkin"
        placeholder="Check-in date"
        value={filters.checkin}
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="checkout"
        placeholder="Check-out date"
        value={filters.checkout}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="region"
        placeholder="Enter region"
        value={filters.region}
        onChange={handleInputChange}
      />
      <select name="type" value={filters.type} onChange={handleInputChange}>
        <option value="">Select type</option>
        <option value="0">Camping</option>
        <option value="1">Glamping</option>
        <option value="2">Caravan</option>
        <option value="3">Pension</option>
      </select>
      <button onClick={handleSearchClick}>Search</button>
      <button onClick={handleResetClick}>Reset Filters</button>
      <ul className="camp-list">
        {camps.map(camp => (
          <li key={camp.camp_id} onClick={() => handleCampClick(camp.camp_id)} className="camp-item">
            <img src={camp.camp_url} alt={camp.camp_name} className="camp-image" />
            <div className="camp-info">
              <h2>{camp.camp_name}</h2>
              <p>{camp.camp_intro}</p>
              <p>Region: {camp.camp_region}</p>
              <p>Address: {camp.camp_address}</p>
              <p>Phone: {camp.camp_phone}</p>
              <p>Check-in: {camp.camp_checkin}</p>
              <p>Check-out: {camp.camp_checkout}</p>
              <p>Amenities: {camp.camp_amenities}</p>
              <p>Manner Time: {camp.camp_manner_time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampList;
