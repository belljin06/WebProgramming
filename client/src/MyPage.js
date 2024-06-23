import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MyPage.css'; // MyPage.css 파일 추가

const MyPage = () => {
  const { member_id } = useParams();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/mypage/${member_id}`);
        console.log('예약 정보:', response.data); // 응답 데이터를 로그로 출력
        setReservations(response.data);
      } catch (error) {
        console.error('예약 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchReservations();
  }, [member_id]);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return '대기';
      case 1:
        return '취소';
      case 2:
        return '예약';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="my-page">
      <h1>My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.reserve_id} className="reservation-item">
              <h2>{reservation.camp_name}</h2>
              <div className="info-container">
                <div className="info-section">
                  <p>Check-in: {new Date(reservation.reserve_checkin).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(reservation.reserve_checkout).toLocaleDateString()}</p>
                  <p>Adults: {reservation.reserve_adult}</p>
                  <p>Children: {reservation.reserve_child}</p>
                  <p>Status: {getStatusText(reservation.reserve_status)}</p>
                </div>
                <div className="info-section site-info">
                  <h3>Site Information</h3>
                  <p>{reservation.site_name}</p>
                  <p>{reservation.site_intro}</p>
                  <p>Cost: {reservation.cost}</p>
                  <p>Max Guests: {reservation.site_max_guests}</p>
                  <img src={reservation.site_url} alt={reservation.site_name} />
                </div>
                <div className="info-section camp-info">
                  <h3>Camp Information</h3>
                  <p>{reservation.camp_address}</p>
                  <p>{reservation.camp_phone}</p>
                  <p>{reservation.camp_intro}</p>
                  <p>Amenities: {reservation.camp_amenities}</p>
                  <img src={reservation.camp_url} alt={reservation.camp_name} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPage;
