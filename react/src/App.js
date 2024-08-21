import styled from "styled-components";
import InCall from "./components/InCall";
import PreJoinRoom from "./components/PreJoinRoom";
import LandingPage from "./components/LandingPage";
import DirectCall from "./components/DirectCall";
import theme from "./theme";
import logo from "./icons/logo.svg";
import { CallProvider, INCALL, PREJOIN, LANDING, DIRECTCALL, useCallState } from "./CallProvider";
import { VoiceEvent, VoiceMessage } from "realtime-ai";
import dailyVoiceClient, { configureForGroupCall, configureForDirectCall } from "./DailyVoiceClient";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

export const MOD = "MOD";
export const SPEAKER = "SPK";
export const LISTENER = "LST";

// Configure event listeners
dailyVoiceClient.on(VoiceEvent.TransportStateChanged, (state) => {
  console.log("[EVENT] Transport state change:", state);
});
dailyVoiceClient.on(VoiceEvent.BotReady, () => {
  console.log("[EVENT] Bot is ready");
});
dailyVoiceClient.on(VoiceEvent.Disconnected, () => {
  console.log("[EVENT] User disconnected");
});

const AppContent = () => {
  const { view } = useCallState();

  // Configure the client based on the view
  switch (view) {
    case LANDING:
    case PREJOIN:
    case INCALL:
      configureForGroupCall();
      break;
    case DIRECTCALL:
      configureForDirectCall();
      break;
    default:
      break;
  }

  return (
    <AppContainer>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink href="#about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#sessions">Sessions</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#resources">Resources</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#contact">Contact</NavLink>
          </NavItem>
        </NavList>
      </Nav>
      <Wrapper>
        {view === LANDING && <LandingPage />}
        {view === DIRECTCALL && <DirectCall />}
        {view === PREJOIN && <PreJoinRoom />}
        {view === INCALL && <InCall />}
      </Wrapper>
    </AppContainer>
  );
};

function App() {
  return (
    <VoiceClientProvider voiceClient={dailyVoiceClient}>
      <CallProvider>
        <AppContent />
        <VoiceClientAudio />
      </CallProvider>
    </VoiceClientProvider>
  );
}

const AppContainer = styled.div`
  background-color: ${theme.colors.greyLightest};
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`;

const NavList = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-left: 20px;
`;

const NavLink = styled.a`
  color: ${theme.colors.greyDark};
  text-decoration: none;
  font-weight: bold;
`;

export default App;
