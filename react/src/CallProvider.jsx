import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import Daily from "@daily-co/daily-js";
import { LISTENER, MOD, SPEAKER } from "./App";
import {
  VoiceClient,
  VoiceEvent,
  StartBotError,
  VoiceError,
  ConnectionTimeoutError
} from "realtime-ai";
import {
  useVoiceClient,
  useVoiceClientEvent
} from "realtime-ai-react";

export const CallContext = createContext(null);

export const PREJOIN = "pre-join";
export const INCALL = "in-call";
export const LANDING = "home"
export const DIRECTCALL = "direct-call"
const MSG_MAKE_MODERATOR = "make-moderator";
const MSG_MAKE_SPEAKER = "make-speaker";
const MSG_MAKE_LISTENER = "make-listener";
const MSG_BOT_READY = "bot-ready";
const FORCE_EJECT = "force-eject";

export const CallProvider = ({ children }) => {
  const [view, setView] = useState(LANDING); // pre-join | in-call
  const [callFrame, setCallFrame] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [roomExp, setRoomExp] = useState(null);
  // const [isBotConnected, setIsBotConnected] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [updateParticipants, setUpdateParticipants] = useState(null);
  const [isBotReady, setIsBotReady] = useState(false);

  const voiceClient = useVoiceClient();

  // voiceClient.on(VoiceEvent.BotReady, () => {
  //   console.log("[EVENT] Bot is ready");
  // });
  // voiceClient.on(VoiceEvent.Connected, () => {
  //   console.log("[EVENT] Voice client session has started");
  // });
  // voiceClient.on(VoiceEvent.Disconnected, () => {
  //   console.log("[EVENT] Disconnected");
  // });

  // const createRoom = async (roomName) => {
  //   if (roomName) return roomName;
  //   const response = await fetch(
  //     // CHANGE THIS TO YOUR NETLIFY URL
  //     // EX: https://myapp.netlify.app/.netlify/functions/room
  //     `${
  //       "https://idyllic-medovik-ab342c.netlify.app"
  //     }/.netlify/functions/room`,
  //     {
  //       method: "POST",
  //     }
  //   ).catch((err) => {
  //     throw new Error(err);
  //   });
  //   const room = await response.json();
  //   return room;
  // };
  // const createToken = async (roomName) => {
  //   if (!roomName) {
  //     setError("Eep! We could not create a token");
  //   }
  //   const response = await fetch(
  //     // CHANGE THIS TO YOUR NETLIFY URL
  //     // EX: https://myapp.netlify.app/.netlify/functions/token
  //     `${
  //       "https://idyllic-medovik-ab342c.netlify.app"
  //     }/.netlify/functions/token`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify({ properties: { room_name: roomName } }),
  //     }
  //   ).catch((err) => {
  //     throw new Error(err);
  //   });
  //   const result = await response.json();
  //   return result;
  // };

  // let roomUrl = "https://supportaiv.daily.co/mental-health"


  const createRoom = useCallback(async () => {
    try {
      // Clear the existing call, room, and participants if they exist
      if (voiceClient._transport._daily) {
        await voiceClient._transport._daily.leave();
        await voiceClient.disconnect();
      }

      let daily = await start();
      console(daily);
      setCallFrame(daily);
      return daily;
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, [voiceClient._transport._daily]);

  async function start() {
    try {
      await voiceClient.start();
      return voiceClient._transport._daily;
    } catch (e) {
      if (e instanceof StartBotError) {
        console.log(e.status, e.message);
        setError(e.message);
      } else if (e instanceof ConnectionTimeoutError) {
        setError(e.message);
      } else {
        setError(e.message || "Unknown error occurred");
      }
    }
  }


  const joinRoom = useCallback(
    async ({ userName, url }) => {
      console.log(voiceClient._transport._daily);
      const call = voiceClient._transport._daily;
      // const call = Daily.createCallObject({
      //   audioSource: true, // start with audio on to get mic permission from user at start
      //   videoSource: false,
      //   dailyConfig: {
      //     experimentalChromeVideoMuteLightOff: true,
      //   },
      // });
      
      const options = {
          url,
          userName,
      };

      function handleJoinedMeeting(evt) {
          setUpdateParticipants(
              `joined-${evt?.participant?.user_id}-${Date.now()}`
          );
          setView(INCALL);
          console.log("[JOINED MEETING]", evt?.participant);
      }

      call.on("joined-meeting", handleJoinedMeeting);

      try {
          await call.join(options);
          setError(false);
          call.setLocalAudio(false);
      } catch (err) {
          setError(err);
      }

      return () => {
          call.off("joined-meeting", handleJoinedMeeting);
      };
    },
    [callFrame]
  );

  // voiceClient.on(VoiceEvent.BotReady, () => {
  //   console.log("[EVENT] Bot is ready");
  // });

  // voiceClient.on(VoiceEvent.Connected, () => {
  //   console.log("[EVENT] Voice client session has started");
  // });

  useVoiceClientEvent(
    VoiceEvent.Connected,
    useCallback(() => {
      console.log(`[SESSION EXPIRY] ${voiceClient.transportExpiry}`);
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotReady,
    useCallback(() => {
      console.log("bot ready");
    }, [])
  );

  useVoiceClientEvent(
    VoiceEvent.BotConnected,
    useCallback((p) => {
      if (!p.local) return;
    }, [])
  );

   useVoiceClientEvent(
    VoiceEvent.ParticipantConnected,
    useCallback((p) => {
      if (!p.local) setCallFrame(voiceClient._transport._daily)
    }, [])
  );

  const handleParticipantJoinedOrUpdated = useCallback((evt) => {
    setUpdateParticipants(`updated-${evt?.participant?.user_id}-${Date.now()}`);
    console.log("[PARTICIPANT JOINED/UPDATED]", evt.participant);
  }, []);

  const handleParticipantLeft = useCallback((evt) => {
    setUpdateParticipants(`left-${evt?.participant?.user_id}-${Date.now()}`);
    console.log("[PARTICIPANT LEFT]", evt);
  }, []);
  const handleActiveSpeakerChange = useCallback((evt) => {
    console.log("[ACTIVE SPEAKER CHANGE]", evt);
    setActiveSpeakerId(evt?.activeSpeaker?.peerId);
  }, []);

  const playTrack = useCallback((evt) => {
    console.log(
      "[TRACK STARTED]",
      evt.participant && evt.participant.session_id
    );
    setUpdateParticipants(
      `track-started-${evt?.participant?.user_id}-${Date.now()}`
    );
  }, []);

  const destroyTrack = useCallback((evt) => {
    console.log("[DESTROY TRACK]", evt);
    setUpdateParticipants(
      `track-stopped-${evt?.participant?.user_id}-${Date.now()}`
    );
  }, []);

  const getAccountType = useCallback((username) => {
    if (!username) return;
    // check last three letters to compare to account type constants
    return username.slice(-3);
  }, []);

  const leaveCall = useCallback(() => {
    if (!callFrame) return;
    async function leave() {
      await callFrame.leave();
    }
    leave();
    setView(PREJOIN);
  }, [callFrame]);

  const removeFromCall = useCallback(
    (participant) => {
      if (!callFrame) return;
      console.log("[EJECTING PARTICIPANT]", participant?.user_id);
      /**
       * When the remote participant receives this message, they'll leave
       * the call on their end.
       */
      callFrame.sendAppMessage({ msg: FORCE_EJECT }, participant?.session_id);
      setUpdateParticipants(
        `eject-participant-${participant?.user_id}-${Date.now()}`
      );
    },
    [callFrame]
  );

  const endCall = useCallback(() => {
    console.log("[ENDING CALL]");
    participants.forEach((p) => removeFromCall(p));
    leaveCall();
  }, [participants, removeFromCall, leaveCall]);

  const displayName = useCallback((username) => {
    if (!username) return;
    // return name without account type
    return username.slice(0, username.length - 4);
  }, []);

  const updateUsername = useCallback(
    (newAccountType) => {
      if (![MOD, SPEAKER, LISTENER].includes(newAccountType)) return;
      /**
       * In case the user had their hand raised, let's make
       * sure to remove that emoji before updating the account type.
       */
      const split = callFrame?.participants()?.local?.user_name.split("✋ ");
      const handRemoved = split.length === 2 ? split[1] : split[0];

      const display = displayName(handRemoved);
      /**
       * The display name is what the participant provided on sign up.
       * We append the account type to their user name so to update
       * the account type we can update the last few letters.
       */
      callFrame.setUserName(`${display}_${newAccountType}`);
    },
    [callFrame, displayName]
  );

  const handleMute = useCallback(
    (p) => {
      if (!callFrame) return;
      if (p?.user_id === "local") {
        callFrame.setLocalAudio(false);
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: false,
        });
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const handleUnmute = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("UNMUTING");
      if (p?.user_id === "local") {
        callFrame.setLocalAudio(true);
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: true,
        });
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const raiseHand = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("RAISING HAND");
      callFrame.setUserName(`✋ ${p?.user_name}`);
      setUpdateParticipants(`raising-hand-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const lowerHand = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("UNRAISING HAND");
      const split = p?.user_name.split("✋ ");
      const username = split.length === 2 ? split[1] : split[0];
      callFrame.setUserName(username);
      setUpdateParticipants(`unraising-hand-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );

  const changeAccountType = useCallback(
    (participant, accountType) => {
      if (!participant || ![MOD, SPEAKER, LISTENER].includes(accountType))
        return;
      /**
       * In case someone snuck in through a direct link, give their username
       * the correct formatting
       */
      let userName;
      if (
        ![MOD, SPEAKER, LISTENER].includes(
          getAccountType(participant?.user_name)
        )
      ) {
        userName = participant?.user_name + `_${accountType}`;
      }
      userName = displayName(participant?.user_name) + `_${accountType}`;
      /**
       * Direct message the participant their account type has changed.
       * The participant will then update their own username with setUserName().
       * setUserName will trigger a participant updated event for everyone
       * to then update the participant list in their local state.
       */
      const msg =
        accountType === MOD
          ? MSG_MAKE_MODERATOR
          : accountType === SPEAKER
          ? MSG_MAKE_SPEAKER
          : MSG_MAKE_LISTENER;

      console.log("[UPDATING PARTICIPANT]");
      if (msg === MSG_MAKE_LISTENER) {
        handleMute(participant);
      }
      callFrame.sendAppMessage(
        { userName, id: participant?.user_id, msg },
        participant?.session_id
      );
    },
    [getAccountType, displayName, handleMute, callFrame]
  );

  useEffect(() => {
    if (!callFrame) return;

    const handleAppMessage = async (evt) => {
        console.log("[APP MESSAGE]", evt);
        try {
            switch (evt?.data?.msg) {
                case MSG_MAKE_MODERATOR:
                    console.log("[LEAVING]");
                    await callFrame.leave();
                    let userName = evt?.data?.userName;
                    if (userName?.includes("✋")) {
                        const split = userName.split("✋ ");
                        userName = split.length === 2 ? split[1] : split[0];
                    }
                    joinRoom({
                        moderator: true,
                        userName,
                        name: room?.name,
                    });
                    break;
                case MSG_BOT_READY: // New message type for bot readiness
                    console.log(evt?.data)
                    break;
                case MSG_MAKE_SPEAKER:
                    updateUsername(SPEAKER);
                    break;
                case MSG_MAKE_LISTENER:
                    updateUsername(LISTENER);
                    break;
                case FORCE_EJECT:
                    leaveCall();
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    };

    const showError = (e) => {
        console.log("[ERROR]");
        console.warn(e);
    };

    callFrame.on("error", showError);
    callFrame.on("participant-joined", handleParticipantJoinedOrUpdated)
    callFrame.on("participant-updated", handleParticipantJoinedOrUpdated);
    callFrame.on("participant-left", handleParticipantLeft);
    callFrame.on("app-message", handleAppMessage);
    callFrame.on("active-speaker-change", handleActiveSpeakerChange);
    callFrame.on("track-started", playTrack);
    callFrame.on("track-stopped", destroyTrack);

    return () => {
        callFrame.off("error", showError);
        callFrame.off("participant-joined", handleParticipantJoinedOrUpdated);
        callFrame.off("participant-updated", handleParticipantJoinedOrUpdated);
        callFrame.off("participant-left", handleParticipantLeft);
        callFrame.off("app-message", handleAppMessage);
        callFrame.off("active-speaker-change", handleActiveSpeakerChange);
        callFrame.off("track-started", playTrack);
        callFrame.off("track-stopped", destroyTrack);
    };
  }, [
    callFrame,
    createRoom,
    joinRoom,
    isBotReady,
    leaveCall,
    room?.name,
    updateUsername,
    handleParticipantJoinedOrUpdated,
    handleActiveSpeakerChange,
    handleParticipantLeft,
    playTrack,
    destroyTrack,
  ]);


  /**
   * Update participants for any event that happens
   * to keep the local participants list up to date.
   * We grab the whole participant list to make sure everyone's
   * status is the most up-to-date.
   */
  useEffect(() => {
    if (updateParticipants) {
      console.log("[UPDATING PARTICIPANT LIST]", callFrame?.participants());
      const list = Object.values(callFrame?.participants() || {});
      // console.log(list)
      // console.log(list[0])
      // if(list[0].user_name === "") {
      //   callFrame.setUserName("_MOD");
      // }
      setParticipants(list);
    }
  }, [updateParticipants, callFrame]);

  useEffect(() => {
    if (!callFrame) return;
    async function getRoom() {
      
      const room = await callFrame?.room();
      console.log("[GETTING ROOM DETAILS]", room);

      const exp = room?.config?.exp;
      setRoom(room);
      if (exp) {
        setRoomExp(exp * 1000 || Date.now() + 1 * 60 * 1000);
      }
      if(view !== DIRECTCALL)
        setView(INCALL);
    }
    getRoom();
  }, [callFrame]);

  return (
    <CallContext.Provider
      value={{
        getAccountType,
        changeAccountType,
        handleMute,
        handleUnmute,
        displayName,
        joinRoom,
        createRoom,
        leaveCall,
        endCall,
        removeFromCall,
        raiseHand,
        lowerHand,
        activeSpeakerId,
        error,
        participants,
        room,
        isBotReady,
        roomExp,
        view,
        setView
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
export const useCallState = () => useContext(CallContext);
