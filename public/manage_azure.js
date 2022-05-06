{   
    //now hardcoded 
    //We will get the info about the number_of_slides server side
    let number_of_slides = 11;
    let authorizationToken;
    let region;
    let authorizationendpoint = 'azure_convert/api/get-speech-token';
    let errorAlert = document.getElementById('error');
    let getVoices = document.getElementById('getVoices');
    let languageOptions = document.getElementById('languageOptions');
    let voiceOptions = document.getElementById('voiceOptions');
    let styleOptions = document.getElementById('styleOptions');
    let settingsButton = document.getElementById('settingsBtn');
    let speedSlider = document.getElementById('myRangeSpeed');
    let pitchSlider = document.getElementById('myRangePitch');
    let slideNumber = document.getElementById('slidenumber');
    let mapLanguageName = new Map();
    let allVoices = [];
    let allSlides = [];
    const speakingStyles = ["affectionate","angry","assistant","calm","chat","cheerful","customerservice",
    "depressed","disgruntled","embarrassed","empathetic","envious","fearful","gentle","lyrical","narration-professional",
    "newscast","newscast-casual","newscast-formal","sad","serious"];
    //not to send to the server because it is not needed for SSML
    let selectedLanguage;
    //to send to the server for SSML synthesis
    let selectedVoice;
    let selectedSlide = '1';
    //initialize speed and pitch with the html default values
    let selectedSpeed = speedSlider.value;
    let selectedPitch = pitchSlider.value;
    let speakingStyle;


    //This map will contain the settings for each slide
    let allsettings = new Map();

    //settings is the settings for one slide
    //all settings id the Map which contains the settings of all the slides
    let initSettings = function(allsettings,number_of_slides,settings){
        //at the beginning all the slides have the same settings
        for(let i = 1; i <= number_of_slides; i++){
            allsettings.set(i.toString(),settings);
        }
    }

    let modifySettings = function(allsettings, settings, selectedSlide){
        //put in the selectedSlide the new settings
        allsettings.set(selectedSlide, settings);
        console.log('check if slide modified correctly');
    }

    let getAllVoices = function (info, allVoices){
        info.forEach((element, index) =>{
            allVoices.push(element.ShortName);
        });
    }

    let loadVoices = function (language) {
        let voices = mapLanguageName.get(language);
        voiceOptions.innerHTML = "";
        // display voices for clicked language
        voices.forEach((element, index) => {
            voiceOptions.innerHTML += "<option value=\"" + element.ShortName + "\">" +
                element.LocalName + "</option>";
        });

        selectedVoice = voices[0].ShortName;
        voiceOptions.disabled = false;
        console.log(selectedVoice);
    }

    let loadLanguages = function () {
        languageOptions.innerHTML = "";
        let languages = Array.from(mapLanguageName.keys());
        if (languages.includes('English (United States)')) {
            selectId = languages.indexOf('English (United States)');
        } else {
            selectId = 0;
        }
        selectedLanguage = languages.at(selectId);
        mapLanguageName.forEach((value, key) => {
            languageOptions.innerHTML += "<option value=\"" + key + "\">" + key + "</option>";
        });
        languageOptions.selectedIndex = selectId;
        languageOptions.disabled = false;
        loadVoices(selectedLanguage);
        styleOptions.disabled = false;
        speakingStyle = speakingStyles[0];
    }

    let fillMap = function (info) {
        if (info[0].LocaleName != undefined) {
            let curLocale = info[0].LocaleName;
            let names = [];
            info.forEach((element, index) => {
                if (curLocale === element.LocaleName) {
                    names.push(new Name(element.LocalName, element.ShortName));
                } else {
                    mapLanguageName.set(`${curLocale}`, names);
                    names = new Array();
                    curLocale = element.LocaleName;
                }
            });
        }
    };


    function Name(LocalName, ShortName) {
        this.LocalName = LocalName;
        this.ShortName = ShortName;
    }


    function Settings(voice, speakingstyle, speed, pitch) {
        this.voice = voice;
        this.speakingstyle = speakingstyle
        this.speed = speed;
        this.pitch = pitch;
    }


    //this function initiliazes all the Web Page
    (async function InitializeConvertAzure(){
        await getAuthorizationToken();
        fillNumberOfSlides();
        await getSettings();
        //init settings for each slide with default parameters
        let settings = createDefaultSettings();
        initSettings(allsettings,number_of_slides,settings);
        console.log('check if all slides are with default settings');
    })();

    function fillNumberOfSlides(){
        slideNumber.innerHTML = "";
        for(let i = 1; i <= number_of_slides; i++){
            allSlides.push(i.toString());
            slideNumber.innerHTML += "<option value=\"" + i + "\">" + i + "</option>";
        }

    }


    function createDefaultSettings(){
        return new Settings(selectedVoice, speakingStyle, selectedSpeed, selectedPitch);
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
    };

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
    //this method triggers the language option in order to display
    //the correct voices for a particular language
    document.addEventListener('click', function (event) {
        if (Array.from(mapLanguageName.keys()).includes(event.target.value)) {
            loadVoices(`${event.target.value}`);
        }
        if(allVoices.includes(event.target.value)){
            selectedVoice = event.target.value;
            console.log(selectedVoice);
        }
        if(speakingStyles.includes(event.target.value)){
            speakingStyle = event.target.value;
            console.log(speakingStyle);
        }
        if(allSlides.includes(event.target.value)){
            selectedSlide = event.target.value;
            console.log(selectedSlide);
        }


    }, false);

    settingsButton.addEventListener('click', () => {
        let modifiedSettings = new Settings(selectedVoice,speakingStyle,selectedSpeed,selectedPitch);
        modifySettings(allsettings,modifiedSettings,selectedSlide);
        console.log('check if the selected slide has been modified');
    })

    speedSlider.addEventListener('change', ()=>{
        selectedSpeed = speedSlider.value;
        document.getElementById('rangevalueSpeed').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', ()=>{
        selectedPitch = pitchSlider.value;
        document.getElementById('rangevaluePitch').textContent = pitchSlider.value;
    })

}