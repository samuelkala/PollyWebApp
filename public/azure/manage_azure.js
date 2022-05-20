
{

    //now hardcoded 
    //We will get the info about the number_of_slides server side
    
    let number_of_slides = 11;
    let file_to_download = localStorage.getItem('filename');
    let authorizationToken;
    let region;
    let authorizationendpoint = '../azure_convert/api/get-speech-token';
    let errorAlert = document.getElementById('error');
    let languageOptions = document.getElementById('languageOptions');
    let voiceOptions = document.getElementById('voiceOptions');
    let styleOptions = document.getElementById('styleOptions');
    let settingsButton = document.getElementById('settingsBtn');
    let speedSlider = document.getElementById('myRangeSpeed');
    let pitchSlider = document.getElementById('myRangePitch');
    let slideNumber = document.getElementById('slidenumber');
    let convertButton = document.getElementById('convertBtn');
    let testButton = document.getElementById('test');
    let mapLanguageName = new Map();
    let allLanguages = [];
    let allVoices = [];
    let allSlides = [];
    let allStyles = [];
    //This array will contain the settings for each slide
    let allsettings = [];
    //not to send to the server because it is not needed for SSML
    let selectedLanguage;
    //to send to the server for SSML synthesis
    let selectedVoice;
    let selectedSlide = '1';
    //initialize speed and pitch with the html default values
    let selectedSpeed = speedSlider.value;
    let selectedPitch = pitchSlider.value;
    let speakingStyle;
    // variable to track the maximum number of styles of all the available voices
    let maxStyles = 0;
    let download_button = document.getElementById('dwn');
    let returnbutton = document.getElementById('return');
    download_button.style.display = 'none';
    returnbutton.style.display = 'none';


    function Name(LocalName, ShortName, StyleList) {
        this.LocalName = LocalName;
        this.ShortName = ShortName;
        this.StyleList = StyleList;
    }


    function Settings(n_slide, voice, speakingstyle, speed, pitch) {
        this.n_slide = n_slide,
        this.voice = voice;
        this.speakingstyle = speakingstyle
        this.speed = speed;
        this.pitch = pitch;
    }

    //this function initiliazes all the Web Page
    (async function InitializeConvertAzure() {
        //console.log(localStorage.getItem('filename'));
        await getAuthorizationToken();
        fillNumberOfSlides();
        await getSettings();
        //init settings for each slide with default parameters
        initSettings(allsettings, number_of_slides);
        console.log('check if all slides are with default settings');
    })()

    function initSettings(allsettings, number_of_slides) {
        //at the beginning all the slides have the same settings a part from field 'n_slide'
        for (let i = 1; i <= number_of_slides; i++) {
            allsettings.push(createDefaultSettings(i.toString()));
        }
    }

    function modifySettings(allsettings, settings, selectedSlide) {
        //put in the selectedSlide the new settings
        allsettings[Number(selectedSlide) - 1] = settings;
        console.log('check if slide modified correctly');
    }

    function getAllVoices(info, allVoices) {
        info.forEach((element) => {
            allVoices.push(element.ShortName);
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

        selectedVoice = voices[0].ShortName;
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
        if (styles != undefined) {
            styleOptions.innerHTML += "<option value=style0>general</option>";
            styles.forEach((element, index) => {
                styleOptions.innerHTML += "<option value=\"style" + (index + 1) + "\">" +
                    element + "</option>";
            });
        } else {
            styleOptions.innerHTML += "<option value=style0>general</option>";
        }
        speakingStyle = 'general';
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
        if (info[0].LocaleName != undefined) {
            let curLocale = info[0].LocaleName;
            let names = [];
            info.forEach((element) => {
                if (curLocale === element.LocaleName) {
                    names.push(new Name(element.LocalName, element.ShortName, element.StyleList));
                    if (element.StyleList != undefined) {
                        if (element.StyleList.length > maxStyles) {
                            maxStyles = element.StyleList.length;
                        }
                    }
                } else {
                    mapLanguageName.set(`${curLocale}`, names);
                    names = new Array();
                    curLocale = element.LocaleName;
                }
            });
            allLanguages = Array.from(mapLanguageName.keys());
            for (let i = 0; i <= maxStyles; i++) {
                allStyles.push('style' + i.toString());
            }
        }
    }



    function fillNumberOfSlides() {
        slideNumber.innerHTML = "";
        for (let i = 1; i <= number_of_slides; i++) {
            allSlides.push(i.toString());
            slideNumber.innerHTML += "<option value=\"" + i + "\">" + i + "</option>";
        }

    }


    function createDefaultSettings(n_slide) {
        return new Settings(n_slide, selectedVoice, speakingStyle, convertSpeed(selectedSpeed), convertPitch(selectedPitch));
    }



    async function getAuthorizationToken() {
        try {
            const response = await fetch(authorizationendpoint);
            const info = await response.json();
            authorizationToken = info.token;
            region = info.region;
            console.log('Token fetched from back-end: ' + authorizationToken);
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = "";
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
            getAllVoices(info, allVoices);
            fillMap(info);
            loadLanguages();
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = "";
            errorAlert.innerHTML = "Error during the retrieving of available voices. Reload the Web Page";
        }
    }


    function convertSpeed(speed) {
        return Math.round(((Number(speed) - 1) * 100)).toString() + '%';
    }

    function convertPitch(pitch) {
        return Math.round(((Number(pitch) - 1) * 50)).toString() + '%';
    }

    //this method is listening for clicks on all the Html document
    //based on what part of the whole document is clicked there is a particular behaviour
    //this method is used to manage events on dynamically created Html elements
    document.addEventListener('click', function (event) {
        if (allLanguages.includes(event.target.value)) {
            selectedLanguage = event.target.value;
            loadVoices(event.target.value);
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
        if (allSlides.includes(event.target.value)) {
            selectedSlide = event.target.value;
            console.log(selectedSlide);
        }


    }, false)

    settingsButton.addEventListener('click', () => {
        let modifiedSettings = new Settings(selectedSlide, selectedVoice, speakingStyle, convertSpeed(selectedSpeed), convertPitch(selectedPitch));
        modifySettings(allsettings, modifiedSettings, selectedSlide);
        console.log('check if the selected slide has been modified');
    })

    speedSlider.addEventListener('change', () => {
        selectedSpeed = speedSlider.value;
        document.getElementById('rangevalueSpeed').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', () => {
        selectedPitch = pitchSlider.value;
        document.getElementById('rangevaluePitch').textContent = pitchSlider.value;
    })

    convertButton.addEventListener('click', async () => {
        let settings_to_send = JSON.stringify({
            file_to_download : file_to_download,
            settings : allsettings
        });
        download_button.style.display = 'inline';

        try {
            const response = await fetch('../azure_convert/getconvparams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: settings_to_send
            });
            const info = await response.json();
            console.log(info);
        } catch (error) {
            console.log(error);
            console.log('error during the sending of the parameters');
        }

    })
    download_button.addEventListener('click', () => {
        download_button.style.display = 'none';
        returnbutton.style.display = 'inline';
  //      document.getElementById('inpFile').value = '';
    })

    testButton.addEventListener('click', async () => {
       console.log('audio started');
//       var  tryAudioAzure = require('libs\azureConvert.js'); 
 //      tryAudioAzure();    

    })

    
}