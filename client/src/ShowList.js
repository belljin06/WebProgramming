import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './ShowList.css';

const ShowList = ({ campingList, onSelect, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState({
    camp_name: '',
    camp_address: '',
    camp_phone: '',
    camp_intro: '',
    camp_url: '',
    camp_checkin: '',
    camp_checkout: '',
    camp_type: '',
    camp_manner_time: '',
    camp_amenities: ''
  });
  const navigate = useNavigate(); // useNavigate 사용

  const handleSiteRegistration = (campId) => {
    navigate(`/register-campsite-site/${campId}`); // campId를 URL 파라미터로 전달
  };

  const handleEdit = (camp, index) => {
    setEditingId(index);
    setEditingValue({
      camp_name: camp.camp_name,
      camp_address: camp.camp_address,
      camp_phone: camp.camp_phone,
      camp_intro: camp.camp_intro,
      camp_url: camp.camp_url,
      camp_checkin: camp.camp_checkin,
      camp_checkout: camp.camp_checkout,
      camp_week: camp.camp_week,
      camp_type: camp.camp_type,
      camp_manner_time: camp.camp_manner_time,
      camp_amenities: camp.camp_amenities
    });
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    let finalValue = value;
  
    // Map camp_type text inputs to numeric values for 'camp_type' field
    if (field === "camp_type") {
      const typeMap = { "캠핑": 0, "글램핑": 1, "카라반": 2, "펜션": 3 };
      finalValue = typeMap[value] !== undefined ? typeMap[value] : value;
    }
  
    setEditingValue(prevState => ({
      ...prevState,
      [field]: finalValue
    }));
  };

  const campTypeToString = (value) => {
    const typeMap = { 0: "캠핑", 1: "글램핑", 2: "카라반", 3: "펜션" };
    return typeMap[value] || value; // Return the string representation or the original value if not found
  };

  const handleUpdate = async (index) => {
    const campId = campingList[index].camp_id; // 가정: campingList 항목에 camp_id가 포함되어 있다고 가정합니다.
    try {
      const response = await fetch(`http://localhost:4000/api/updateData/${campId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingValue),
      });
      if (response.ok) {
        console.log('캠핑장 정보가 성공적으로 업데이트되었습니다.');
        onUpdate(index, editingValue); // UI 업데이트를 위한 상태 변경
      } else {
        console.error('캠핑장 정보 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('캠핑장 정보 업데이트 중 오류가 발생했습니다:', error);
    }
    setEditingId(null);
    setEditingValue({
      camp_name: '',
      camp_address: '',
      camp_phone: '',
      camp_intro: '',
      camp_url: '',
      camp_checkin: '',
      camp_checkout: '',
      camp_type: '',
      camp_manner_time: '',
      camp_amenities: ''
    });
  };

  return (
    <ul className='showList-ul'>
      {campingList.map((camp, index) => (
        <li key={index}>
          {editingId === index ? (
            <>
            <p>캠핑장이름</p>
              <input
                type="text"
                value={editingValue.camp_name}
                onChange={(e) => handleChange(e, 'camp_name')}
              />
              <p>캠핑장주소</p>
              <input
                type="text"
                value={editingValue.camp_address}
                onChange={(e) => handleChange(e, 'camp_address')}
              />
              <p>캠핑장전화번호</p>
              <input
                type="text"
                value={editingValue.camp_phone}
                onChange={(e) => handleChange(e, 'camp_phone')}
              />
              <p>캠핑장소개</p>
              <input
                type="text"
                value={editingValue.camp_intro}
                onChange={(e) => handleChange(e, 'camp_intro')}
              />
              <p>캠핑장사진</p>
              <input
                type="text"
                value={editingValue.camp_url}
                onChange={(e) => handleChange(e, 'camp_url')}
              />
                <p>캠핑장체크인</p>
              <input
                type="text"
                value={editingValue.camp_checkin}
                onChange={(e) => handleChange(e, 'camp_checkin')}
              />
                <p>캠핑장체크아웃</p>
              <input
                type="text"
                value={editingValue.camp_checkout}
                onChange={(e) => handleChange(e, 'camp_checkout')}
              />
                <p>캠핑장유형(캠핑,글램핑,카라반,펜션)</p>
                <input
                type="text"
                value={campTypeToString(editingValue.camp_type)}
                onChange={(e) => handleChange(e, 'camp_type')}
              />
                <p>캠핑장매너시간</p>
                <input
                type="text"
                value={editingValue.camp_manner_time}
                onChange={(e) => handleChange(e, 'camp_manner_time')}
              />
                <p>캠핑장편의시설</p>
                <input
                type="text"
                value={editingValue.camp_amenities}
                onChange={(e) => handleChange(e, 'camp_amenities')}
              />
              <button onClick={() => handleUpdate(index)}>완료</button>
            </>
          ) : (
            <>
              <img className="sholist_img" src={camp.camp_url} alt={camp.camp_name} />
              <div>{camp.camp_name} - {camp.camp_address}</div>
              <button onClick={() => handleEdit(camp, index)}>수정</button>
              <button onClick={() => handleSiteRegistration(camp.camp_id)}>사이트 등록</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ShowList;