import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setMember_id }) => {
  const [login_id, setLoginId] = useState('');
  const [login_pw, setLoginPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log('로그인 요청:', { login_id, login_pw }); // 로그인 요청 로그
      const response = await axios.post('http://localhost:4000/login', { login_id, login_pw });
      console.log('로그인 응답:', response.data); // 로그인 응답 로그
      if (response.data.success) {
        setIsLoggedIn(true);
        setMember_id(response.data.member_id);
        navigate('/camp-list');
      } else {
        alert('로그인 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 실패');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="login_id">ID:</label>
        <input
          type="text"
          id="login_id"
          name="login_id"
          value={login_id}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <br />
        <label htmlFor="login_pw">Password:</label>
        <input
          type="password"
          id="login_pw"
          name="login_pw"
          value={login_pw}
          onChange={(e) => setLoginPw(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
