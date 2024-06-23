import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const apiUrl = 'http://localhost:4000/api/insertCampSiteData';

const SiteRegistration = () => {
    const { campId } = useParams(); // URL에서 campId 추출 //사이트 db변경에대한 변화
  const [formData, setFormData] = useState({
    camp_id: campId, // Assuming camp_id is passed as a prop to this component
    cost: '',
    site_url: '',
    site_max_guests: '',
    site_intro: ''
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Campsite data successfully saved:', response.data);
    } catch (error) {
      console.error('Error saving campsite data:', error);
    }
  };

  // Log to verify camp_id is correctly set
  console.log("Passed camp_id:", campId);
  console.log("FormData state:", formData);

  return (
    <form onSubmit={handleSubmit}>
      <p>캠핑 사이트 등록</p>
      <input type="hidden" name="camp_id" value={campId} />
      <p>비용 cost (int)</p>
      <input type="number" name="cost" placeholder="Enter Cost" onChange={handleChange} />
      <p>캠핑 사이트 사진 URL site_url (varchar)</p>
      <input type="text" name="site_url" placeholder="Enter Camp Site URL" onChange={handleChange} />
      <p>최대 게스트 수 site_max_guests (int)</p>
      <input type="number" name="site_max_guests" placeholder="Enter Max Guests" onChange={handleChange} />
      <p>캠핑 사이트 소개 site_intro (text)</p>
      <textarea name="site_intro" placeholder="Enter Introduction" onChange={handleChange}></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SiteRegistration;
