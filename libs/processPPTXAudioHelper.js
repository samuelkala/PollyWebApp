const { generateAudioAws } = require('./awsConvert');
const { generateAudioAzure } = require('./azureConvert');

const pollyParams = {
    "Text": "",
    "OutputFormat": "mp3",
    "Engine": "",
    "TextType": "ssml",
    "VoiceId": ""
}

/**
 * processPPTXAudioHelper helps perform audio conversion for processPPTXFile
 * @param notes[] array of notes to be converted to audio
 * @param finalConfig, @param fileName, @param relPath
 * @resolve Promise
 * @reject Error 
 * @sample processPPTXAudioHelper(['Some text I want to convert'], Json, 'filename', './<path>/);
 */



const delay = (duration) =>
    new Promise(resolve => setTimeout(resolve, duration));


async function processPPTXAudioHelper(notes, settings, fileName, relPath) {
    return new Promise(async (resolve) => {
        let promiseArray = [];
        for(i in notes){
            if(settings.type.localeCompare('aws') === 0){
                pollyParams.Text = notes[i][1];
                pollyParams.Engine = settings.engine;
                pollyParams.VoiceId = settings.voice;
                promiseArray.push(generateAudioAws(pollyParams, `media${notes[i][0]}`, `${relPath}${fileName}/ppt/media/`));
                await delay(200);
            } else {
                promiseArray.push(generateAudioAzure(notes[i][1], `media${notes[i][0]}`, `${relPath}${fileName}/ppt/media/`));
                await delay(200);
            }
        }
        Promise.all(promiseArray).then((response) => {
            resolve(response);
        }).catch((e) => console.log(e));
    });
}

module.exports = {
    processPPTXAudioHelper
}