import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiUrl = 'http://localhost:4000/api/insertData';

const RegisterCampsiteInfo = () => {
  const { member_id } = useParams(); // Extract member_id from URL
  const [formData, setFormData] = useState({
    member_id: '',
    camp_name: '',
    camp_address: '',
    camp_region:'',
    camp_phone: '',
    camp_intro: '',
    camp_url: '',
    camp_checkin: '',
    camp_checkout: '',
    camp_type: '',
    camp_manner_time: '',
    camp_amenities: ''
  });

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      member_id: member_id
    }));
  }, [member_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
  
    // Map camp_type text inputs to numeric values
    if (name === "camp_type") {
      const typeMap = { "캠핑": 0, "글램핑": 1, "카라반": 2, "펜션": 3 };
      finalValue = typeMap[value] !== undefined ? typeMap[value] : value;
    }
  
    setFormData(prevState => ({
      ...prevState,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Data successfully saved:', response.data);
    } catch (error) {
      console.error('Data saving error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>캠핑장 등록</p>
      <p>캠핑장주인아이디 member_id (int) {member_id}</p>
      <input type="hidden" name="member_id" value={formData.member_id} onChange={handleChange} />
      <p>캠핑장이름 camp_name (varchar)</p> 
      <input type="text" name="camp_name" placeholder="Enter Camp Name" onChange={handleChange} />
      <p>캠핑장주소 camp_address (text)</p> 
      <input type="text" name="camp_address" placeholder="Enter Address" onChange={handleChange} />
      <p>캠핑장지역 camp_region (text)</p> 
      <input type="text" name="camp_region" placeholder="Enter camp_region" onChange={handleChange} />
      <p>캠핑장전화번호 camp_phone (varchar)</p>
      <input type="text" name="camp_phone" placeholder="Enter Phone Number" onChange={handleChange} />
      <p>캠핑장소개 camp_intro (text)</p>
      <textarea name="camp_intro" placeholder="Enter Introduction" onChange={handleChange}></textarea>
      <p>캠핑장사진 camp_url (varchar)</p>
      <input type="text" name="camp_url" accept="image/*" onChange={handleChange} />
      <p>캠핑장체크인 camp_checkin 00:00 (varchar)</p>
      <input type="text" name="camp_checkin" placeholder="Enter Check-In Time" onChange={handleChange} />
      <p>캠핑장체크아웃 camp_checkout 00:00 (varchar)</p>
      <input type="text" name="camp_checkout" placeholder="Enter Check-Out Time" onChange={handleChange} />
      <p>캠핑장 유형 camp_type (캠핑,글램핑,카라반,펜션)</p>
      <input type="text" name="camp_type" placeholder="Enter Camp Type" onChange={handleChange} />
      <p>캠핑장매너타임 camp_manner_time 00:00 (varchar)</p>
      <input type="text" name="camp_manner_time" placeholder="Enter Manner Time" onChange={handleChange} />
      <p>캠핑장편의시설 camp_amenities (varchar)</p>
      <input type="text" name="camp_amenities" placeholder="Enter camp_amenities" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegisterCampsiteInfo;
// https://www.gyeongju.go.kr/upload/content/thumb/20191227/89168A01077F4174B315A1742141A6B2.jpg

///api/campsiteinsert

// datetime-local db를 시간으로 변경해야함

//<input type="file" name="camp_url" accept="image/*" onChange={handleImageUpload} />


