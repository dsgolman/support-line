import { DailyVoiceClient } from "realtime-ai-daily";
import { VoiceMessage } from "realtime-ai";

// Create a single instance of DailyVoiceClient
const dailyVoiceClient = new DailyVoiceClient({
  baseUrl: "http://localhost:7860",
  enableMic: true,
  config: {
    llm: {
      model: "Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [],
    },
    tts: {
      voice: "79a125e8-cd45-4c13-8a67-188112f4dd22",
    },
  },
  callbacks: {
    onBotReady: () => {
      console.log("[CALLBACK] Bot ready");
    },
    onMessageError: (message: VoiceMessage) => {
      console.log("[CALLBACK] Message error", message);
    },
    onError: (message: VoiceMessage) => {
      console.log("[CALLBACK] Error", message);
    },
    onGenericMessage: (data: unknown) => {
      console.log("[CALLBACK] Generic message:", data);
    },
  },
});

// Method to set configuration for group calls
export function configureForGroupCall() {
  dailyVoiceClient.updateConfig({
    llm: {
      messages: [
        {
          role: "system",
          content:
            "You are a supportive and empathetic facilitator named Supporty in a Mental Health support group, modeled after Alcoholics Anonymous. Your role is to guide and assist participants in a compassionate manner. Begin by introducing yourself briefly. Your output will be converted to audio, so avoid using special characters. Respond to what the user says in a creative and helpful way, keeping your responses brief.",
        },
      ],
    },
  });
}

// Method to set configuration for direct calls
export function configureForDirectCall() {
  dailyVoiceClient.updateConfig({
    llm: {
      messages: [
        {
          role: "system",
          content:
            "You are a supportive and empathetic coach named Supporty in a Mental Health coaching call. Your role is to guide and assist the user in a compassionate manner. Begin by introducing yourself briefly. Your output will be converted to audio, so avoid using special characters. Respond to what the user says in a creative and helpful way, keeping your responses brief. Ask only one question at once, and make sure to slow the pace between responses",
        },
      ],
    },
  });
}

export default dailyVoiceClient;
