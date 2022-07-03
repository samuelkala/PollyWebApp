//Global Variables
//This object will contain the settings for all the slides
let allsettings;
//variable which will contain the settings saved by the cookie
let savedsettings = getCookie('saveSettings');

let file_to_download = localStorage.getItem('filename');
let tts = document.getElementById("tts");
let lAzure = document.getElementById('lAzure');
let vAzure = document.getElementById('vAzure');
let sAzure = document.getElementById('sAzure');
let slidecontainerSpeed = document.getElementById('slidecontainerSpeed');
let slidecontainerPitch = document.getElementById('slidecontainerPitch');
let allsettingsBtn = document.getElementById('allsettingsBtn');
let download_button = document.getElementById('dwn');
let returnbutton = document.getElementById('return');
let errorAlert = document.getElementById('error');
let hidInput = document.getElementById('hidInp');
download_button.style.display = 'none';
errorAlert.innerHTML = "";
hidInput.value = file_to_download;
let loadingDots = document.getElementById('LoadDots');
let setloadingDots = document.getElementById('setLoadDots');
let doneMessage = document.getElementById('done');


function convertPitch(pitch) {
    let p = Math.round(((Number(pitch) - 1) * 50)).toString() + '%';
    return p;
}

function invertPitch(pitchpercentage){
    let pitch = Number(pitchpercentage.split('%')[0]);
    pitch = ((pitch/50) + 1).toFixed(2);
    return pitch;
}

function modifyAllSettings(newsettings) {
    allsettings = newsettings;
    console.log('check if slides modified correctly');
}


{

    let authorizationToken;
    let region;
    let authorizationendpoint = '../settings/api/get-speech-token';
    let languageOptions = document.getElementById('languageOptions');
    let voiceOptions = document.getElementById('voiceOptions');
    let styleOptions = document.getElementById('styleOptions');
    let speedSlider = document.getElementById('myRangeSpeed');
    let pitchSlider = document.getElementById('myRangePitch');
    let convertButton = document.getElementById('convertBtn');
    let mapLanguageName = new Map();
    let allLanguages = [];
    let allVoices = [];
    let allStyles = [];

    //variable to support the selection of voice and style in case they are saved by a cookie
    let isSaved = false;

    //these are the variables which contain the current status of the settings

    let selectedLanguage;
    let selectedVoice;
    //initialize speed and pitch with the html default values
    let selectedSpeed = speedSlider.value;
    let selectedPitch = pitchSlider.value;
    let speakingStyle;
    

    function Name(LocalName, ShortName, StyleList) {
        this.LocalName = LocalName;
        this.ShortName = ShortName;
        this.StyleList = StyleList;
    }


    function Settings(language, voice, speakingstyle, speed, pitch) {
        this.type = 'azure';
        this.language = language;
        this.voice = voice;
        this.speakingstyle = speakingstyle
        this.speed = speed;
        this.pitch = pitch;
    }

    //this function initiliazes all the Web Page
    (async function initAzure() {
        setloadingDots.style.display= 'inline';
        await getAuthorizationToken();
        await getSettings();
        if(savedsettings !== null && savedsettings.type.localeCompare('azure') === 0){
            isSaved = true;
            selectedLanguage = savedsettings.language;
            selectedVoice = savedsettings.voice;
            speakingStyle = savedsettings.speakingstyle;
            selectedSpeed = invertSpeed(savedsettings.speed);
            selectedPitch = invertPitch(savedsettings.pitch);
            setSavedSettings();
            isSaved = false;
        }
        if(savedsettings === null || (savedsettings !== null && savedsettings.type.localeCompare('azure') === 0)){
            initSettings();
        }
        console.log('check if all slides are with default settings');
    })()


    function initSettings() {
        allsettings = new Settings(selectedLanguage, selectedVoice, speakingStyle, convertSpeed(selectedSpeed), convertPitch(selectedPitch));
        setloadingDots.style.display= 'none';
    }

    function setSavedSettings(){
        languageOptions.value = selectedLanguage;
        loadVoices(selectedLanguage);
        voiceOptions.value = selectedVoice;
        let voices = mapLanguageName.get(selectedLanguage);
        loadSpeakingStyles(voices,selectedVoice);
        styleOptions.value = speakingStyle;
        speedSlider.value = selectedSpeed;
        document.getElementById('rangevalueSpeed').textContent = selectedSpeed;
        pitchSlider.value = selectedPitch;
        document.getElementById('rangevaluePitch').textContent = selectedPitch;
    }

    function getAllVoicesLanguagesStyles(info) {
        info.forEach((element) => {
            allVoices.push(element.ShortName);
            if(!allLanguages.includes(element.LocaleName)){
                allLanguages.push(element.LocaleName);
            }
            if(element.StyleList != null){
                element.StyleList.forEach((style) => {
                    if(!allStyles.includes(style)){
                        allStyles.push(style);
                    }
                })
            }
        });
    }

    function loadVoices(language) {
        let voices = mapLanguageName.get(language);
        voiceOptions.innerHTML = "";
        // display voices for clicked language
        voices.forEach((element) => {
            voiceOptions.innerHTML += "<option value=\"" + element.ShortName + "\">" +
                element.LocalName + "</option>";
        });
        if(!isSaved){
            selectedVoice = voices[0].ShortName;
        }
        voiceOptions.disabled = false;
        loadSpeakingStyles(voices, selectedVoice);
        console.log(selectedVoice);
    }

    function loadSpeakingStyles(voices, selVoice) {
        let voice = voices.find(v => {
            return v.ShortName === selVoice;
        });

        let styles = voice.StyleList;

        styleOptions.innerHTML = "";
        styleOptions.innerHTML += "<option value=\"general\">general</option>";
        if (styles != undefined) {
            styles.forEach((element, index) => {
                styleOptions.innerHTML += "<option value=\"" + element + "\">" +
                    element + "</option>";
            });
        }
        if(!isSaved){
            speakingStyle = 'general';
        }
        styleOptions.disabled = false;
        console.log('check if speaking styles loaded correctly');
    }

    function loadLanguages() {
        let selectId;
        languageOptions.innerHTML = "";
        if (allLanguages.includes('English (United States)')) {
            selectId = allLanguages.indexOf('English (United States)');
        } else {
            selectId = 0;
        }
        selectedLanguage = allLanguages.at(selectId);
        allLanguages.forEach((element) => {
            languageOptions.innerHTML += "<option value=\"" + element + "\">" + element + "</option>";
        });
        languageOptions.selectedIndex = selectId;
        languageOptions.disabled = false;
        loadVoices(selectedLanguage);
    }

    function fillMap(info) {
        let peoplespeakinglang = [];
        let names = [];
        allLanguages.forEach((lang) => {
            peoplespeakinglang = info.filter(voice => voice.LocaleName === lang);
            peoplespeakinglang.forEach((p) => {
                names.push(new Name(p.LocalName, p.ShortName, p.StyleList));
            });
            mapLanguageName.set(lang, names);
            names = new Array();
        });
    }

    //this function retrieves the token to get all the available voices and related speaking styles
    async function getAuthorizationToken() {
        try {
            const response = await fetch(authorizationendpoint);
            const info = await response.json();
            authorizationToken = info.token;
            region = info.region;
            console.log('Token fetched from back-end: ' + authorizationToken);
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = 'error while getting authorization Token! Reload the WebPage!';
        }
    }

    async function getSettings() {
        try {
            const response = await fetch('https://' + region + ".tts.speech." +
                (region.startsWith("china") ? "azure.cn" : "microsoft.com") +
                "/cognitiveservices/voices/list", {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authorizationToken
                }
            });
            const info = await response.json();
            getAllVoicesLanguagesStyles(info);
            fillMap(info);
            loadLanguages();
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = "Error during the retrieving of available voices. Reload the Web Page";
        }
    }


    function convertSpeed(speed) {
        return Math.round(((Number(speed) - 1) * 100)).toString() + '%';
    }

    function invertSpeed(speedpercentage){
        let speed = Number(speedpercentage.split('%')[0]);
        speed = ((speed/100) + 1).toFixed(2);
        return speed;
    }

    
    //this method is listening for clicks on all the Html document
    //based on what part of the whole document is clicked there is a particular behaviour
    //this method is used to manage events on dynamically created Html elements
    document.addEventListener('click', function (event) {
        if (allLanguages.includes(event.target.value)) {
            selectedLanguage = event.target.value;
            loadVoices(selectedLanguage);
        }
        if (allVoices.includes(event.target.value)) {
            let voices = mapLanguageName.get(selectedLanguage);
            selectedVoice = event.target.value;
            loadSpeakingStyles(voices, selectedVoice);
            console.log(selectedVoice);
        }
        if (allStyles.includes(event.target.value)) {
            let selectedStyle = styleOptions.options[styleOptions.selectedIndex];
            speakingStyle = selectedStyle.text;
            console.log(speakingStyle);
        }
    }, false)

    speedSlider.addEventListener('change', () => {
        selectedSpeed = speedSlider.value;
        document.getElementById('rangevalueSpeed').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', () => {
        selectedPitch = pitchSlider.value;
        document.getElementById('rangevaluePitch').textContent = pitchSlider.value;
    })

    allsettingsBtn.addEventListener('click', () => {
        convertButton.style.display = 'inline';
        if (tts.value === 'microsoft') {
            let newsettings = new Settings(selectedLanguage, selectedVoice, speakingStyle, convertSpeed(selectedSpeed), convertPitch(selectedPitch));
            modifyAllSettings(newsettings);
        }
    })

    convertButton.addEventListener('click', async () => {
        allsettingsBtn.style.display = 'none';
        //save settings before convertion
        //so that next time the user uses the app he will find the last settings used
        setCookie('saveSettings',JSON.stringify(allsettings));
        let settings_to_send = JSON.stringify({
            file_to_download: file_to_download,
            settings: allsettings
        });
        convertButton.style.display = 'none';
        doneMessage.style.display = 'none';
        loadingDots.style.display = 'inline';
        try {
            const response = await fetch('../settings/getconvparams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: settings_to_send
            });
            await response.json();
            loadingDots.style.display = 'none';
            download_button.style.display = 'inline';

        } catch (error) {
            loadingDots.style.display = 'none';
            console.log(error);
            errorAlert.innerHTML = "Error during the convertion. Return to Home and retry!";
            returnbutton.style.display = 'inline';
        }

    })

}

download_button.addEventListener('click', () => {
    download_button.style.display = 'none';
    doneMessage.style.display = 'inline';
})

function selectService() {
    if (tts.value == "microsoft") {
        lAzure.removeAttribute("hidden");
        vAzure.removeAttribute("hidden");
        sAzure.removeAttribute("hidden");
        slidecontainerSpeed.removeAttribute("hidden");
        slidecontainerPitch.removeAttribute("hidden");
        lAws.setAttribute("hidden", "hidden");
        vAws.setAttribute("hidden", "hidden");
        tAws.setAttribute("hidden", "hidden");
        sAws.setAttribute("hidden", "hidden");
        pAws.setAttribute("hidden", "hidden");
    } else {
        lAws.removeAttribute("hidden");
        vAws.removeAttribute("hidden");
        tAws.removeAttribute("hidden");
        sAws.removeAttribute("hidden");
        pAws.removeAttribute("hidden");
        lAzure.setAttribute("hidden", "hidden");
        vAzure.setAttribute("hidden", "hidden");
        sAzure.setAttribute("hidden", "hidden");
        slidecontainerSpeed.setAttribute("hidden", "hidden");
        slidecontainerPitch.setAttribute("hidden", "hidden");
    }

}

