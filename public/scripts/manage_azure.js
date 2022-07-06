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

let azureSettings = {
    type: "azure",
    language: "",
    voice: "",
    speakingstyle: "",
    speed: "",
    pitch: ""
};


function convertPitch(pitch) {
    let p = Math.round(((Number(pitch) - 1) * 50)).toString() + '%';
    return p;
}

function invertPitch(pitchpercentage) {
    let pitch = Number(pitchpercentage.split('%')[0]);
    pitch = ((pitch / 50) + 1).toFixed(2);
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


    azureSettings.speed = convertSpeed(speedSlider.value);
    azureSettings.pitch = convertPitch(speedSlider.value);

    function Name(LocalName, ShortName, StyleList) {
        this.LocalName = LocalName;
        this.ShortName = ShortName;
        this.StyleList = StyleList;
    }


    //this function initiliazes all the Web Page
    (async function initAzure() {
        setloadingDots.style.display = 'inline';
        await getAuthorizationToken();
        await getSettings();
        if (savedsettings != null && savedsettings.type.localeCompare('azure') === 0) {
            isSaved = true;
            azureSettings.language = savedsettings.language;
            azureSettings.voice = savedsettings.voice;
            azureSettings.speakingstyle = savedsettings.speakingstyle;
            azureSettings.speed = savedsettings.speed;
            azureSettings.pitch = savedsettings.pitch;
            setSavedSettings();
            isSaved = false;
        }
        if (savedsettings === null || (savedsettings != null && savedsettings.type.localeCompare('azure') === 0)) {
            allsettings = azureSettings;
            setloadingDots.style.display = 'none';
        }
        console.log('check if all slides are with default settings');
    })()


    function setSavedSettings() {
        loadLanguages();
        speedSlider.value = invertSpeed(azureSettings.speed);
        document.getElementById('rangevalueSpeed').textContent = speedSlider.value;
        pitchSlider.value = invertPitch(azureSettings.pitch);
        document.getElementById('rangevaluePitch').textContent = pitchSlider.value;
    }

    //add General style too AllStyles
    function getAllVoicesLanguagesStyles(info) {
        info.forEach((element) => {
            allVoices.push(element.ShortName);
            if (!allLanguages.includes(element.LocaleName)) {
                allLanguages.push(element.LocaleName);
            }
            if (element.StyleList != null) {
                element.StyleList.forEach((style) => {
                    if (!allStyles.includes(style)) {
                        allStyles.push(style);
                    }
                })
            }
        });
        allStyles.push('general');
    }

    function loadVoices(language) {
        let voices = mapLanguageName.get(language);
        voiceOptions.innerHTML = "";
        // display voices for clicked language
        voices.forEach((element) => {
            voiceOptions.innerHTML += "<option value=\"" + element.ShortName + "\">" +
                element.LocalName + "</option>";
        });
        if (!isSaved) {
            azureSettings.voice = voices[0].ShortName;
        }
        voiceOptions.value = azureSettings.voice;
        voiceOptions.disabled = false;
        loadSpeakingStyles(voices, azureSettings.voice);
        console.log(azureSettings.voice);
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
        if (!isSaved) {
            azureSettings.speakingstyle = 'general';
        }
        styleOptions.value = azureSettings.speakingstyle;
        styleOptions.disabled = false;
        console.log('check if speaking styles loaded correctly');
    }

    function loadLanguages() {
        languageOptions.innerHTML = "";
        allLanguages.forEach((element) => {
            languageOptions.innerHTML += "<option value=\"" + element + "\">" + element + "</option>";
        });

        if (!isSaved) {
            let selectId;
            if (allLanguages.includes('English (United States)')) {
                selectId = allLanguages.indexOf('English (United States)');
            } else {
                selectId = 0;
            }
            azureSettings.language = allLanguages.at(selectId);
        }
        languageOptions.value = azureSettings.language;
        languageOptions.disabled = false;
        loadVoices(azureSettings.language);
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
            if (savedsettings === null || (savedsettings != null && savedsettings.type.localeCompare('aws') === 0)) {
                loadLanguages();
            }
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = "Error during the retrieving of available voices. Reload the Web Page <i class='fa fa-warning'></i>";
        }
    }


    function convertSpeed(speed) {
        return Math.round(((Number(speed) - 1) * 100)).toString() + '%';
    }

    function invertSpeed(speedpercentage) {
        let speed = Number(speedpercentage.split('%')[0]);
        speed = ((speed / 100) + 1).toFixed(2);
        return speed;
    }


    //this method is listening for clicks on all the Html document
    //based on what part of the whole document is clicked there is a particular behaviour
    //this method is used to manage events on dynamically created Html elements
    document.addEventListener('click', function (event) {
        if (allLanguages.includes(event.target.value)) {
            azureSettings.language = event.target.value;
            loadVoices(azureSettings.language);
        }
        if (allVoices.includes(event.target.value)) {
            let voices = mapLanguageName.get(azureSettings.language);
            azureSettings.voice = event.target.value;
            loadSpeakingStyles(voices, azureSettings.voice);
            console.log(azureSettings.voice);
        }
        if (allStyles.includes(event.target.value)) {
            let selectedStyle = styleOptions.options[styleOptions.selectedIndex];
            azureSettings.speakingstyle = selectedStyle.text;
            console.log(azureSettings.speakingstyle);
        }
    }, false)

    speedSlider.addEventListener('change', () => {
        azureSettings.speed = convertSpeed(speedSlider.value);
        document.getElementById('rangevalueSpeed').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', () => {
        azureSettings.pitch = convertPitch(pitchSlider.value);
        document.getElementById('rangevaluePitch').textContent = pitchSlider.value;
    })

    convertButton.addEventListener('click', async () => {
        //save settings before convertion
        //so that next time the user uses the app he will find the last settings used
        setCookie('saveSettings', JSON.stringify(allsettings));
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
            errorAlert.innerHTML = "Conversion error, return to home and retry.";
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
        allsettings = azureSettings;
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
        allsettings = awsSettings;
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

