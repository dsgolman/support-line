import React from "react";
import styled from "styled-components";
import theme from "../theme";
import { useCallState, PREJOIN, DIRECTCALL } from "../CallProvider";

const LandingPage = () => {
  const { setView } = useCallState();

  const handleGroupCall = () => {
    setView(PREJOIN);
  };

  const handleDirectCall = () => {
    setView(DIRECTCALL);
  };

  return (
    <LandingContainer>
      <HeroSection>
        <HeroTitle>24/7 Mental Health Support</HeroTitle>
        <HeroDescription>
          Join our welcoming audio support group anytime, day or night. Find comfort, connection, and guidance from our community.
        </HeroDescription>
        <HeroButtons>
          <HeroButton onClick={handleGroupCall}>Join Group Session</HeroButton>
          <HeroButton onClick={handleDirectCall}>1-on-1 Live Support</HeroButton>
        </HeroButtons>
      </HeroSection>

      <GroupSessions>
        <SessionTitle>Upcoming Group Sessions (Coming Soon)</SessionTitle>
        <SessionsContainer>
          <SessionCard>
            <SessionCardTitle>Morning Session</SessionCardTitle>
            <SessionCardDescription>
              Monday - Friday, 8am - 10am
            </SessionCardDescription>
            <SessionCardDescription>
              Start your day with our supportive community. Share your thoughts, listen to others, and find the strength to face the day.
            </SessionCardDescription>
            <SessionButton disabled>Coming Soon</SessionButton>
          </SessionCard>
          <SessionCard>
            <SessionCardTitle>Afternoon Session</SessionCardTitle>
            <SessionCardDescription>
              Monday - Friday, 2pm - 4pm
            </SessionCardDescription>
            <SessionCardDescription>
              Take a break and connect with our community during the workday. Share your struggles, find support, and recharge for the rest of the day.
            </SessionCardDescription>
            <SessionButton disabled>Coming Soon</SessionButton>
          </SessionCard>
          <SessionCard>
            <SessionCardTitle>Evening Session</SessionCardTitle>
            <SessionCardDescription>
              Monday - Sunday, 8pm - 10pm
            </SessionCardDescription>
            <SessionCardDescription>
              End your day with our supportive community. Share your reflections, find comfort, and prepare for a restful night.
            </SessionCardDescription>
            <SessionButton disabled>Coming Soon</SessionButton>
          </SessionCard>
        </SessionsContainer>
      </GroupSessions>

      <Footer>
        <FooterContent>
          <FooterTitle>Find the Support You Need, Anytime</FooterTitle>
          <FooterButtons>
            <FooterButton onClick={handleGroupCall}>Join 24/7 Group</FooterButton>
            <FooterButton onClick={handleDirectCall}>1-on-1 Live Support</FooterButton>
          </FooterButtons>
        </FooterContent>
        <FooterLinks>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
        <FooterCopy>&copy; 2024 Mental Health Support. All rights reserved.</FooterCopy>
      </Footer>
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  background-color: ${theme.colors.background}; 
  color: ${theme.colors.text}; 
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 100px 20px;
  background-color: ${theme.colors.primary}; 
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: ${theme.colors.text}; 
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: ${theme.colors.text}; 
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const HeroButton = styled.button`
  background-color: ${theme.colors.buttonBackground}; 
  color: ${theme.colors.buttonText}; 
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.buttonHover}; 
  }

  &:disabled {
    background-color: ${theme.colors.disabledBackground}; 
    cursor: not-allowed;
  }
`;

const GroupSessions = styled.section`
  padding: 50px 20px;
  text-align: center;
  background-color: ${theme.colors.background}; 
`;

const SessionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 40px;
  color: ${theme.colors.text}; 
`;

const SessionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const SessionCard = styled.div`
  background-color: ${theme.colors.cardBackground}; 
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  text-align: left;
`;

const SessionCardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: ${theme.colors.text}; 
`;

const SessionCardDescription = styled.p`
  margin-bottom: 20px;
  color: ${theme.colors.text}; 
`;

const SessionButton = styled(HeroButton)`
  margin-top: 20px;
`;

const Footer = styled.footer`
  width: 100%;
  background-color: ${theme.colors.footerBackground}; 
  padding: 50px 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  margin-bottom: 30px;
`;

const FooterTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${theme.colors.text}; 
`;

const FooterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const FooterButton = styled(HeroButton)``;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const FooterLink = styled.a`
  color: ${theme.colors.link}; 
  text-decoration: none;

  &:hover {
    color: ${theme.colors.linkHover}; 
  }
`;

const FooterCopy = styled.p`
  margin-top: 20px;
  color: ${theme.colors.text}; 
`;

export default LandingPage;
