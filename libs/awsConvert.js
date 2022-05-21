const AWS = require('aws-sdk');
const Fs = require('fs');


const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

/**
 * Synthesize speech request
 * @param params Polly parameters: Text, OutputFormat, VoiceId
 * @param fileName A name for the audio file to be generated.
 * @param audioPath Output filePath
 * @resolve file path of the local generated audio file 
 * @reject Error 
 */
async function generateAudioAws (params, fileName, audioPath) {
    return new Promise((resolve, reject) => {
        console.log('\nGenerating Audio');
        Polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                if (err.hasOwnProperty('originalError')) {
                    reject(err.originalError.code);
                }
                else {
                    reject(err);
                }
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    // path to store audio file
                    const filePath = audioPath + '/' + fileName + '.mp3';
                    Fs.writeFile(filePath, data.AudioStream, (err) => {
                        if (err)
                            reject('Folder not found: ' + audioPath);
                        else
                            resolve(filePath);
                    })
                }
            }
        })
    })
}

module.exports = {
    generateAudioAws
}