import React from 'react';
import styled from 'styled-components';

// Styled components for the ChatCard
const CardContainer = styled.div`
  background-color: ${({ role }) => (role === 'assistant' ? '#2e3a47' : '#1e2a39')};
  color: #c8d8e4;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const Role = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Timestamp = styled.div`
  font-size: 0.8rem;
  color: #9aa5b1;
  margin-bottom: 10px;
`;

const Content = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
`;

const EmotionsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const EmotionBadge = styled.span`
  background-color: #4b6b88;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
`;

const ChatCard = ({ role, timestamp, content, scores }) => {
  return (
    <CardContainer role={role}>
      <Role>{role === 'assistant' ? 'EVI' : 'User'}</Role>
      <Timestamp>{timestamp}</Timestamp>
      <Content>{content}</Content>
      {scores && (
        <EmotionsContainer>
          {scores.map(({ emotion, score }) => (
            <EmotionBadge key={emotion}>
              {emotion}: {score}
            </EmotionBadge>
          ))}
        </EmotionsContainer>
      )}
    </CardContainer>
  );
};

export default ChatCard;
