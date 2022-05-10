const sdkAzure = require("microsoft-cognitiveservices-speech-sdk");
require('dotenv').config();

const speechConfig = 
sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY,process.env.SPEECH_REGION);

let audioConfig;

let synthesizer; 

async function generateAudioAzure(text, filename, audiopath){
    return new Promise((resolve, reject) => {
        audioConfig = sdkAzure.AudioConfig.fromAudioFileOutput(audiopath + filename);
        synthesizer = new sdkAzure.SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakSsmlAsync(text,complete_cb,err_cb);
        
    })
}

function complete_cb(result) {
    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
      console.log("synthesis finished");
    } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
      console.log("synthesis failed. Error detail: " + result.errorDetails);
    }
    synthesizer.close();
    synthesizer = undefined;
  };


  function err_cb(err) {
    console.log(err);
    synthesizer.close();
    synthesizer = undefined;
  };