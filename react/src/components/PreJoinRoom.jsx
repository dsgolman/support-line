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


  useEffect(() => {
    const setupRoom = async () => {
      if (!isBotReady) {
        try {
          const roomInfo = await createRoom();
          setRoomUrl(roomInfo.url);
          setRoomCreated(true);
        } catch (err) {
          console.error('Error creating room:', err);
        }
      }
    };

    setupRoom();
  }, [isBotReady]);

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
        if (!isBotReady) {
          url = roomUrl || ''; // Use the URL from the state
          userName = `${userName?.trim()}_${MOD}`;
        } else {
          url = `https://supportaiv.daily.co/default-room`;
          userName = `${userName?.trim()}_${LISTENER}`;
        }
      }

      try {
        await joinRoom({ userName, url });
      } catch (err) {
        console.error('Error joining room:', err);
      } finally {
        setSubmitting(false);
      }
    },
    [firstNameRef, lastNameRef, roomNameRef, joinRoom, submitting, isBotReady, roomUrl]
  );

  return (
    <Container>
      <Title>Getting started</Title>
      {!isBotReady ? (
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 400px;
  margin-top: 48px;

  @media only screen and (min-width: 768px) {
    justify-content: flex-start;
    margin-top: 32px;
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.large};
  color: ${theme.colors.blueDark};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 0 24px;
`;

const SmallText = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.greyDark};
  margin: 2px 0;
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
  padding: 4px;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 4px;

  &:focus {
    outline: ${theme.colors.grey} auto 1px;
  }
`;

const Submit = styled(Input)`
  margin-top: 16px;
  border: ${theme.colors.cyanLight} 2px solid;
  background-color: ${theme.colors.turquoise};
  padding: 5px;
  font-size: ${theme.fontSize.base};
  font-weight: 600;
  height: 36px;
  cursor: pointer;

  &:active {
    background-color: ${theme.colors.cyan};
  }
  &:hover {
    border: ${theme.colors.cyan} solid 2px;
  }
`;

const ErrorText = styled.p`
  margin-left: auto;
  color: ${theme.colors.red};
`;

export default PreJoinRoom;
