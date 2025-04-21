import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import axios from 'axios';

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #111;
  color: #eee;
`;

const Title = styled.h2`
  color: #eee;
  margin-bottom: 20px;
`;

const DataItem = styled.p`
  margin-bottom: 10px;
`;

const RequestList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RequestItem = styled.li`
  background-color: #222;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  flex-grow: 1;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ApproveButton = styled.button`
  background-color: #5cb85c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #4cae4c;
  }
`;

const RejectButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };

        const usersResponse = await axios.get('/api/admin/dashboard-data', config);
        setTotalUsers(usersResponse.data.totalUsers);

        const requestsResponse = await axios.get('/api/admin/pending-teacher-requests', config);
        setPendingRequests(requestsResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error('Error fetching admin dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
      await axios.put(`/api/admin/approve-teacher-request/${requestId}`, {}, config);
      // Refresh the list of pending requests after approval
      const requestsResponse = await axios.get('/api/admin/pending-teacher-requests', config);
      setPendingRequests(requestsResponse.data);
    } catch (err) {
      setError('Failed to approve teacher request.');
      console.error('Error approving teacher request:', err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
      await axios.put(`/api/admin/reject-teacher-request/${requestId}`, {}, config);
      // Refresh the list of pending requests after rejection
      const requestsResponse = await axios.get('/api/admin/pending-teacher-requests', config);
      setPendingRequests(requestsResponse.data);
    } catch (err) {
      setError('Failed to reject teacher request.');
      console.error('Error rejecting teacher request:', err);
    }
  };

  return (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DataItem>Total Users: {totalUsers}</DataItem>

      <h3>Pending Teacher Authorization Requests:</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending teacher authorization requests.</p>
      ) : (
        <RequestList>
          {pendingRequests.map((request) => (
            <RequestItem key={request._id}>
              <UserInfo>
                <strong>{request.userId.name}</strong> ({request.userId.email})
                <p>Requested on: {new Date(request.requestDate).toLocaleDateString()}</p>
                {request.bio && <p>Bio: {request.bio.substring(0, 50)}...</p>}
                {request.experience && <p>Experience: {request.experience.substring(0, 50)}...</p>}
                {request.areasOfInterest && <p>Interests: {request.areasOfInterest.join(', ')}</p>}
              </UserInfo>
              <Actions>
                <ApproveButton onClick={() => handleApprove(request._id)}>Approve</ApproveButton>
                <RejectButton onClick={() => handleReject(request._id)}>Reject</RejectButton>
              </Actions>
            </RequestItem>
          ))}
        </RequestList>
      )}
    </DashboardContainer>
  );
}

export default AdminDashboard;