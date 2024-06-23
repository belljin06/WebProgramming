import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowList from './ShowList';
import { useParams } from 'react-router-dom';

const apiUrl = 'http://localhost:4000/api';

const EditCampsiteInfo = () => {
    const [campingList, setCampingList] = useState([]);
    const { member_id } = useParams(); // Extract member_id from URL
  
    useEffect(() => {
      if (member_id) {
        axios.get(`${apiUrl}/camping/${member_id}`)
          .then(response => {
            setCampingList(response.data);
          })
          .catch(error => console.error('Error:', error));
      }
    }, [member_id]);
  
    return (
      <div>
        <ShowList campingList={campingList} />
      </div>
    );
  };

export default EditCampsiteInfo;