{
    let number_of_slides = 0;
    let authorizationToken;
    let region;
    let authorizationendpoint = 'azure_convert/api/get-speech-token';
    let errorAlert = document.getElementById('error');
    let getVoices = document.getElementById('getVoices');
    let languageOptions = document.getElementById('languageOptions');
    let voiceOptions = document.getElementById('voiceOptions');
    let mapLanguageName = new Map();
    let allVoices = [];
    //not to send to the server because it is not needed for SSML
    let selectedLanguage;
    let selectedVoice;
    let selectedSpeed;
    let selectedPitch;
    let speakingStyle;
    let settings = [];

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


    function Settings(language, voice, speed, pitch) {
        this.language = language;
        this.voice = voice;
        this.speed = speed;
        this.pitch = pitch;
    }

    (async function getAuthorizationToken() {
        try {
            const response = await fetch(authorizationendpoint);
            const info = await response.json();
            authorizationToken = info.token;
            region = info.region;
            console.log('Token fetched from back-end: ' + authorizationToken);
        } catch (err) {
            console.log(err);
            errorAlert.innerHTML = 'error while getting authorization Token';
        }
    })();

    getVoices.addEventListener('click', async () => {
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
            console.log('hello');
        } catch (err) {
            console.log(err);
            console.log('error during the retrieving the voices');
        }
    })

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
    }, false);









}