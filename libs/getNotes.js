const path = require('path');
const fs = require('fs');

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const mainSSmlAzure = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">';

/**
 * getNotes takes a path to folder containing xmls and then parses each file for extrating lecture notes
 * @param folderPath
 * @resolve Promise json object of all text
 * @reject Error
 * @sample  getNotes('path/to/xmls')
 */

async function getNotes(folderPath, convertionType, settings) {
    return new Promise((resolve, reject) => {
        let texts=[];

        //TODO: Need to absolute path from Driver funcation.
        fs.readdir(folderPath, function (err, files) {
            //handling error
            if (err) {
                console.log('Unable to scan directory: ' + err);
                reject(err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                try {
                    if(file.includes("notesSlide")) {

                        let slide_number=file.match(/\d+/).toString();       
                        name=file.toString();
                        temp_path=folderPath+file;
    
                        let xmlContent = require('fs').readFileSync(temp_path, 'utf8');
                        
                        // Extract slide notes from xml using <a:t> tags
                        let openTextTag = xmlContent.indexOf('<a:t>')
                        let closeTextTag = 0
                        let endTextTag = xmlContent.indexOf('</p:txBody>')
                        let text = ''
                        while (openTextTag < endTextTag && openTextTag != -1) {
                            closeTextTag = xmlContent.indexOf('</a:t>', openTextTag)
                            text += entities.decode(xmlContent.slice(openTextTag+5, closeTextTag))
                            openTextTag = xmlContent.indexOf('<a:t>', closeTextTag)
                        }
                        // Add <speak> tag for Polly
                        if(convertionType.localeCompare('azure') === 0){
                            text = addAzureSsml(text, settings[Number(slide_number)-1]);
                        }else{
                            text = '<speak>' + text + '</speak>'
                        }
                        texts.push([slide_number,text]);
                    }
                }
                catch(e) {
                    // console.log(temp_path, e.message);
                    return;
                }
            });
            resolve(texts);
        });
    }); 
}

function addAzureSsml(text, settings){
    text = mainSSmlAzure + addAzureVoice(settings.voice) + addAzureStyle(settings.speakingstyle) +
    addAzureSpeedPitch(settings.speed,settings.pitch) + text + closeTagAzure(settings.speakingstyle);
    return text;
}

function addAzureVoice(voice){
    return '<voice name="' + voice + '">';
}

function addAzureSpeedPitch(speed, pitch){
    return '<prosody rate="' + speed + '" pitch="' + pitch + '">';
}

function addAzureStyle(style){
    if(!(style.localeCompare('general') === 0)){
        return '<mstts:express-as style="' + style + '" >';
    }else{
        return '';
    }
}

function closeTagAzure(style){
    if(!(style.localeCompare('general') === 0)){
        return '</prosody></mstts:express-as></voice></speak>';
    }else{
        return '</prosody></voice></speak>';
    }
}


module.exports = {
    getNotes
}
