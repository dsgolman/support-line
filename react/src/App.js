import styled from "styled-components";
import InCall from "./components/InCall";
import PreJoinRoom from "./components/PreJoinRoom";
import theme from "./theme";
import logo from "./icons/logo.svg";
import { SmallText } from "./components/shared/SmallText";
import { CallProvider, INCALL, PREJOIN, useCallState } from "./CallProvider";
import { VoiceClient } from "realtime-ai";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

export const MOD = "MOD";
export const SPEAKER = "SPK";
export const LISTENER = "LST";

const voiceClient = new VoiceClient({
  baseUrl: "http://localhost:7860",
  enableMic: true,
  config: {
        "llm": {
            "model": "llama3-70b-8192",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful hotel concierge assistant named Q. Your role is to assist guests with their needs and provide exceptional service. When greeting guests, aim for a warm and friendly tone. Start with a brief and courteous introduction, making them feel welcome and valued. Offer to help with any requests they may have and provide a brief overview of the services you can offer."
                },
                {
                    "role": "system",
                    "content": "Example: Hello and welcome to our hotel! I'm Q, your friendly concierge assistant. I'm here to help make your stay as enjoyable and comfortable as possible. If you need assistance with anything, whether it's booking a reservation, finding local attractions, or simply getting some recommendations, just let me know. I'm here to ensure you have a wonderful experience!"
                }
            ]
            // "messages": [
            //   {
            //     "role": "system",
            //     "content": "You are a supportive and empathetic facilitator named Supporty in a Mental Health support group, modeled after Alcoholics Anonymous. Your role is to guide and assist participants in a compassionate manner. Begin by introducing yourself briefly. Your output will be converted to audio, so avoid using special characters. Respond to what the user says in a creative and helpful way, keeping your responses brief."
            //   }
            // ]
        },
        "tts": {
            "voice": "79a125e8-cd45-4c13-8a67-188112f4dd22"
        }
    }
});

const AppContent = () => {
  const { view } = useCallState();
  return (
    <AppContainer>
      <Wrapper>
        <Header>
          <HeaderTop>
            <Title>Party line</Title>
            <Logo src={logo} className="App-logo" alt="logo" />
          </HeaderTop>
          <SmallText>An audio API demo from Daily</SmallText>
        </Header>
        {view === PREJOIN && <PreJoinRoom />}
        {view === INCALL && <InCall />}
        <Link
          center={view === INCALL}
          href="https://docs.daily.co/guides/demos#party-line-a-multiplatform-audio-only-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about this demo
        </Link>
      </Wrapper>
    </AppContainer>
  );
};

function App() {
  return (
    <VoiceClientProvider voiceClient={voiceClient}>
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
  overflow-y: scroll;
  overflow-x: hidden;
`;
const Wrapper = styled.div`
  max-width: 700px;
  padding: 32px 24px 0;
  min-height: 100%;
  margin: 0 auto;
`;
const Logo = styled.img`
  height: 24px;
`;
const Header = styled.header`
  display: flex;
  flex-direction: column;
`;
const HeaderTop = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1`
  font-size: ${theme.fontSize.xxlarge};
  color: ${theme.colors.blueDark};
  margin: 4px 0;
  font-weight: 600;
`;
const Link = styled.a`
  font-weight: 400;
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.greyDark};
  display: flex;
  justify-content: center;
  max-width: 400px;

  @media only screen and (min-width: 768px) {
    justify-content: ${(props) => (props.center ? "center" : "flex-start")};
    max-width: ${(props) => (props.center ? "100%" : "400px")};
  }
`;

export default App;
