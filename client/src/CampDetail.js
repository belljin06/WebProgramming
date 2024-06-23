import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import './CampDetail.css'; // 스타일링을 위한 CSS 파일 추가

const CampDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [camp, setCamp] = useState(null);
  const [sites, setSites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    checkin: new URLSearchParams(location.search).get('checkin') || '',
    checkout: new URLSearchParams(location.search).get('checkout') || ''
  });

  useEffect(() => {
    const fetchCampDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/camps/${id}`);
        setCamp(response.data.camp);
        setSites(response.data.sites);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("There was an error fetching the camp details!", error);
      }
    };

    fetchCampDetail();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/camps/${id}`, {
        params: {
          checkin: filters.checkin,
          checkout: filters.checkout
        }
      });
      setSites(response.data.sites);
    } catch (error) {
      console.error("There was an error fetching the site details!", error);
    }
  };

  if (!camp) return <div>Loading...</div>;

  return (
    <div className="camp-detail">
      <h1>{camp.camp_name}</h1>
      <img src={camp.camp_url} alt={camp.camp_name} className="camp-image" />
      <div className="camp-info">
        <p>{camp.camp_intro}</p>
        <p>Region: {camp.camp_region}</p>
        <p>Address: {camp.camp_address}</p>
        <p>Phone: {camp.camp_phone}</p>
        <p>Check-in: {camp.camp_checkin}</p>
        <p>Check-out: {camp.camp_checkout}</p>
        <p>Amenities: {camp.camp_amenities}</p>
        <p>Manner Time: {camp.camp_manner_time}</p>
      </div>
      <div className="filter-section">
        <h2>Search Sites</h2>
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
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <h2>Sites</h2>
      <ul className="site-list">
        {sites.map(site => (
          <li key={site.site_id} className="site-item">
            <h3>{site.site_name}</h3>
            <p>{site.site_intro}</p>
            <p>Status: {site.reserve_status === 0 ? 'Pending' : site.reserve_status === 1 ? 'Available' : 'Unavailable'}</p>
          </li>
        ))}
      </ul>
      <h2>Reviews</h2>
      <ul className="review-list">
        {reviews.map(review => (
          <li key={review.review_id} className="review-item">
            <p>{review.review_comment}</p>
            {review.review_url && <img src={review.review_url} alt="Review" className="review-image" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampDetail;
