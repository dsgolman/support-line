const axios = require("axios");

const BASE_URL = process.env.DAILY_BASE_URL || "https://api.daily.co/v1/"
const API_AUTH = process.env.DAILY_API_KEY;

// create an axios instance that includes the BASE_URL and your auth token
// this may be useful to put in an external file to it can be referenced
// elsewhere once your application grows
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { Authorization: `Bearer ${API_AUTH}` },
});

exports.apiHelper = async (method, endpoint, body = {}) => {
  try {
    const response = await api.request({
      url: endpoint,
      method: method,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.log("Status: ", error.response);
    console.log("Text: ", error.response);
    // need to throw again so error is caught
    // a possible improvement here is to pass the status code back so it can be returned to the user
    throw new Error(error);
  }
};


// curl --request POST \
//      --url https://api.daily.co/v1/ \
//      --header 'Accept: application/json' \
//      --header 'Authorization: Bearer e20e11c2e1fe20a5acead7a469e231aea2f5e3af0d714665af2fbcca70a3d540' \
//      --header 'Content-Type: application/json' \
//      --data '{"properties": { "enable_transcription": "deepgram:6daa6d673d9f5e2e93f1f83ea0e94babaf9706e9" }}'