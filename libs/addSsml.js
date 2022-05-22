const mainSSmlAzure = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">';


function addAwsSsml(text, settings){
    text = addSpeakTag() + addAwsRatePitch(settings.speed, settings.pitch, settings.engine) +
    addAwsTimbre(settings.timbre, settings.engine) + text + closeTagAws(settings.engine);
    return text;
}

function addSpeakTag(){
    return '<speak>';
}

function addAwsRatePitch(rate, pitch, engine) {
    if(engine.localeCompare('standard') === 0){
        return '<prosody rate = "' + rate + '" pitch = "' + pitch  + '">';
    } else {
        return '<prosody rate = "' + rate + '">';
    }
}

function addAwsTimbre(timbre, engine) {
    if(engine.localeCompare('standard') === 0){
        return '<amazon:effect vocal-tract-length="'+ timbre + '">';
    } else {
        return '';
    }
}

function closeTagAws(engine) {
    if(engine.localeCompare('standard') === 0){
        return '</amazon:effect></prosody></speak>';
    } else {
        return '</prosody></speak>';
    }
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
    addAwsSsml,
    addAzureSsml
}