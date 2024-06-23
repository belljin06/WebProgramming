import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ShowList.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const { member_id } = useParams(); // URL에서 member_id를 정확히 가져옴

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reservations/confirmed/${member_id}`);
        setReservations(response.data);
      } catch (error) {
        console.error('예약 내역 조회 중 오류 발생:', error);
      }
    };

    fetchReservations();
  }, [member_id]);

  const updateReservationStatus = async (reserve_id, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/reservations/update/${reserve_id}`, { status });
      console.log(response.data); // 예약 상태 변경 성공 메시지 로그
      // Optionally, refresh the reservations list or show a success message
    } catch (error) {
      console.error('예약 상태 변경 실패:', error);
    }
  };

  return (
    <div>
      <h2>예약 관리</h2>
      <ul className='showList-ul'>
        {reservations.map((reservation, index) => (
          <li key={index}>
            <p>예약 ID: {reservation.reserve_id}</p>
            <p>캠핑장 이름: {reservation.camp_name}</p>
            <p>예약자 이름: {reservation.member_name}</p>
            <p>예약자 ID: {reservation.member_id}</p>
            <p>성인 수: {reservation.reserve_adult}</p>
            <p>아동 수: {reservation.reserve_child}</p>
            <p>체크인: {reservation.reserve_checkin}</p>
            <p>체크아웃: {reservation.reserve_checkout}</p><p>예약 상태: {reservation.reserve_status === 0 ? '대기' : reservation.reserve_status === 1 ? '취소' : reservation.reserve_status === 2 ? '확정' : ''}</p><p>사이트 ID: {reservation.site_id}</p>
            
            <button onClick={() => updateReservationStatus(reservation.reserve_id,2)}>예약확정</button>
            <button onClick={() => updateReservationStatus(reservation.reserve_id,1)}>예약거절</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationManagement;