// src/pages/Leaderboard.jsx
import React from 'react';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi'; // Import the user icon

const LeaderboardContainer = styled(motion.div)`
  flex-grow: 1;
  padding: 40px;
  background-color: #111;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LeaderboardTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #ddd;
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 80%;
`;

const LeaderboardItem = styled.li`
  background-color: #222;
  color: #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Rank = styled.span`
  width: 50px;
  text-align: center;
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-left: 20px;
`;

const UserName = styled.span`
  font-size: 1.1rem;
`;

const Points = styled.span`
  width: 100px;
  text-align: right;
  font-weight: bold;
`;

function Leaderboard() {
  const users = [
    { id: 101, name: 'Cosmic Explorer', points: 1550 },
    { id: 102, name: 'Stellar Navigator', points: 2100 },
    { id: 103, name: 'Nebula Adventurer', points: 1200 },
    { id: 104, name: 'Galactic Pioneer', points: 1800 },
    { id: 105, name: 'Dark Matter Detective', points: 2500 },
    { id: 106, name: 'Exoplanet Enthusiast', points: 950 },
    { id: 107, name: 'Astrobiologist', points: 1700 },
    { id: 108, name: 'Spacefarer', points: 2300 },
    { id: 109, name: 'Black Hole Observer', points: 1400 },
  ];

  const rankedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <LeaderboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <LeaderboardList>
        {rankedUsers.map((user, index) => (
          <LeaderboardItem key={user.id}>
            <Rank>{index + 1}</Rank>
            <UserInfo>
              <FiUser size={40} color="#eee" style={{ marginRight: '15px' }} />
              <UserName>{user.name}</UserName>
            </UserInfo>
            <Points>{user.points}</Points>
          </LeaderboardItem>
        ))}
      </LeaderboardList>
    </LeaderboardContainer>
  );
}

export default Leaderboard;