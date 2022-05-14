const { getPollyParams } = require('./getPollyParams');
const { generateAudio } = require('./polly');
const { generateAudioAzure} = require('./azureConvert');

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

    //async function processPPTXAudioHelper(notes, convertionType, finalConfig, fileName, relPath)
async function processPPTXAudioHelper(notes, convertionType, fileName, relPath) {
    return new Promise(async (resolve) => {
        promiseArray = [];
        if (convertionType.localeCompare('aws') === 0) {
            for (i in notes) {
                let pollyParams = getPollyParams(notes[i][1], finalConfig.sharedConfig)
                promiseArray.push(generateAudio(pollyParams, `media${notes[i][0]}`, `${relPath}${fileName}/ppt/media/`));
                await delay(200);
            };
        } else {
            for (i in notes) {
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