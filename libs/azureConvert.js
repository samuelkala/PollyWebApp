const sdkAzure = require("microsoft-cognitiveservices-speech-sdk");
require('dotenv').config();

const speechConfig = sdkAzure.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);

const AUDIO_FORMAT = sdkAzure.SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3;
speechConfig.speechSynthesisOutputFormat = AUDIO_FORMAT;

async function generateAudioAzure(text, filename, audiopath) {
  return new Promise((resolve, reject) => {
    console.log("\nGenerating Audio Azure...");
    let filePath = audiopath + '/' + filename + '.mp3';
    let audioConfig = sdkAzure.AudioConfig.fromAudioFileOutput(filePath);
    let synthesizer = new sdkAzure.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakSsmlAsync(text, (result) => {
      if (result.reason === sdkAzure.ResultReason.SynthesizingAudioCompleted) {
        resolve(filePath);
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails);
        reject(result.errorDetails);
      }
      synthesizer.close();
      synthesizer = null;
    },
    (err) => {
        console.log('Got an error');
        console.trace("err - " + err);
        reject(err);
        synthesizer.close();
        synthesizer = null;
    });
  })
}

module.exports = {
  generateAudioAzure
}