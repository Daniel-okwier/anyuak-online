import React, { useState } from 'react';
import { styled } from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #111;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  color: #eee;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #222;
  color: #ddd;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.div`
  margin-top: 15px;
  color: #5cb85c;
`;

const ErrorMessage = styled.div`
  margin-top: 15px;
  color: #d9534f;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 10px;
  color: #ddd;
  text-decoration: none;

  &:hover {
    color: #eee;
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
  
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const body = JSON.stringify({ email, password });
  
      const response = await axios.post('http://localhost:5000/api/auth/login', body, config);
      // If login is successful
      setMessage('Login successful! Redirecting...');
      localStorage.setItem('token', response.data.token);
  
      // Fetch user data after login
      const userResponse = await axios.get('http://localhost:5000/api/auth/current-user', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      localStorage.setItem('user', JSON.stringify(userResponse.data));
  
      // Redirect based on role
      if (userResponse.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userResponse.data.role === 'teacher' && userResponse.data.isApproved) {
        navigate('/teacher/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Here, we set the error message only if there's an issue with the login
      setError(err.response?.data?.errors?.[0]?.msg || 'Login failed.');
      console.error('Login error:', err);
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email Address:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Login</Button>
        <ForgotPasswordLink to="/forgot-password">Forgot Password?</ForgotPasswordLink>
        {message && <Message>{message}</Message>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </LoginContainer>
  );
}

export default Login;
