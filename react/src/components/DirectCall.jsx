import React, { useState, useCallback } from "react";
import styled from "styled-components";
import {
  VoiceClient,
  VoiceEvent
} from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";
import { useCallState } from "../CallProvider";
import Participant from "./Participant";
import Audio from "./Audio";

const DirectCall = () => {
  const voiceClient = useVoiceClient();
  const {
    participants,
    room,
    view,
    getAccountType,
    leaveCall,
    handleMute,
    handleUnmute,
    endCall,
  } = useCallState();
  const [isInCall, setIsInCall] = useState(false);

  const handleStart = async () => {
    try {
      await voiceClient.start();
      
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleStop = async () => {
    try {
      await voiceClient.disconnect();
      setIsInCall(false);
    } catch (error) {
      console.error("Error stopping call:", error);
    }
  };

  useVoiceClientEvent(
    VoiceEvent.Connected,
    useCallback(() => {
      console.log(`[SESSION EXPIRY] ${voiceClient.transportExpiry}`);
      setIsInCall(true);
    }, [])
  );

  return (
    <DirectCallContainer>
      <ButtonContainer id="btn-container">
        <ControlButton
          id="start-btn"
          onClick={handleStart}
          disabled={isInCall}
        >
          Start
        </ControlButton>
        <ControlButton
          id="stop-btn"
          onClick={handleStop}
          disabled={!isInCall}
        >
          Stop
        </ControlButton>
      </ButtonContainer>
      <HeadingContainer id="heading-container">
        <Heading>Mental Health Coach</Heading>
        <Description>
          Welcome to our Empathic Voice Bot. Click the "Start" button and begin talking to interact with EVI.
        </Description>
      </HeadingContainer>
      <Audio participants={participants}/>
    </DirectCallContainer>
  );
};

const DirectCallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #0a0d1b;
  color: #c8d8e4;
  min-height: 100vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const ControlButton = styled.button`
  background-color: #2e9cca;
  color: white;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e70a2;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const HeadingContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ChatContainer = styled.div`
  background-color: #1e2a39;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
`;

export default DirectCall;
