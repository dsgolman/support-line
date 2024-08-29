import { useCallback, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { LISTENER, MOD } from '../App';
import theme from '../theme';
import { useCallState } from '../CallProvider';

const PreJoinRoom = () => {
  const { createRoom, joinRoom, isBotReady, error } = useCallState();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const roomNameRef = useRef(null);
  const [roomName, setRoomName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);

  const checkBotStatus = useCallback(async (roomUrl) => {
    try {
      const response = await fetch(`https://flyio-example-summer-sound-5998.fly.dev/status?room_url=${roomUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data; // Return the bot status directly
      } else {
        console.error('Failed to fetch bot status');
        return false;
      }
    } catch (error) {
      console.error('Error fetching bot status:', error);
      return false;
    }
  }, []);

  const setupRoom = async (userName, roomUrl) => {
    try {
      let {room_url, status} = await checkBotStatus(roomUrl);
      if(status === "not_ready") {
        let result = await createRoom(userName, room_url);
        console.log(result);
      } else {

        try {
            await joinRoom({ userName, room_url });
          } catch (err) {
            console.error('Error joining room:', err);
          } finally {
            setSubmitting(false);
          }
      }

    } catch (err) {
      console.error('Error creating room:', err);
    }
  };

  // useEffect(() => {
    
  //   setupRoom();
  // }, [checkBotStatus, createRoom]);

  const handleRoomChange = (e) => {
    setRoomName(e?.target?.value);
  };

  const submitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;

      setSubmitting(true);

      if (!firstNameRef?.current || !lastNameRef?.current) return;

      let userName = `${firstNameRef?.current?.value} ${lastNameRef?.current?.value}`;
      let url = '';

      if (roomNameRef?.current?.value?.trim()) {
        url = `https://supportaiv.daily.co/${roomNameRef?.current?.value?.trim()}`;
        userName = `${userName?.trim()}_${LISTENER}`;
      } else {
        // if (!isBotReady) {
        //   url = roomUrl || ''; // Use the URL from the state
        //   userName = `${userName?.trim()}_${MOD}`;
        // } else {
        //   url = `https://supportaiv.daily.co/default-room`;
        //   userName = `${userName?.trim()}_${LISTENER}`;
        // }
      }

      await setupRoom(userName, url);

    },
    [firstNameRef, lastNameRef, roomNameRef, joinRoom, submitting, isBotReady, roomUrl]
  );

  return (
    <Container>
      <InnerContainer>
        <Title>Getting started</Title>
        {roomUrl ? (
          <p>Please wait, setting up the room...</p>
        ) : (
          <Form onSubmit={submitForm}>
            <Label htmlFor="fname">First name</Label>
            <Input ref={firstNameRef} type="text" id="fname" name="fname" required />
            <Label htmlFor="lname">Last name</Label>
            <Input ref={lastNameRef} type="text" id="lname" name="lname" />
            <Label htmlFor="room">Join code</Label>
            <Input ref={roomNameRef} type="text" id="room" name="room" onChange={handleRoomChange} />
            <SmallText>
              Enter code to join an existing room, or leave empty to create a new room.
            </SmallText>
            <Submit
              type="submit"
              value={submitting ? 'Joining...' : roomName?.trim() ? 'Join room' : 'Create and join room'}
            />
            {error && <ErrorText>Error: {error.toString()}</ErrorText>}
          </Form>
        )}
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: ${theme.colors.white};
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 450px;
  width: 100%;
  background-color: ${theme.colors.greyLight};
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.large};
  color: ${theme.colors.blueDark};
  margin-bottom: 24px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SmallText = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.greyDark};
  margin: 8px 0;
  text-align: center;
`;

const Label = styled.label`
  color: ${theme.colors.blueDark};
  font-size: ${theme.fontSize.base};
  margin-bottom: 4px;
  line-height: 16px;
  margin-top: 16px;
  font-weight: 400;
`;

const Input = styled.input`
  border-radius: 8px;
  border: ${theme.colors.grey} 1px solid;
  padding: 12px;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${theme.colors.cyan};
    box-shadow: 0 0 0 2px ${theme.colors.cyanLight};
  }
`;

const Submit = styled.input`
  margin-top: 16px;
  border: none;
  background-color: ${theme.colors.turquoise};
  padding: 12px;
  font-size: ${theme.fontSize.base};
  font-weight: 600;
  height: 48px;
  cursor: pointer;
  color: ${theme.colors.white};
  border-radius: 8px;
  width: 100%;
  text-align: center;

  &:active {
    background-color: ${theme.colors.cyan};
  }

  &:hover {
    background-color: ${theme.colors.cyanLight};
  }
`;

const ErrorText = styled.p`
  margin-left: auto;
  color: ${theme.colors.red};
`;

export default PreJoinRoom;
