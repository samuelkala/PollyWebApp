{
    let languageOptions = document.getElementById('languageOptionsAws');
    let voiceOptions = document.getElementById('voiceOptionsAws');
    let selectedVoice;
    let selectedEngine;
    let voices = [];
    let names_engine = [];
    let languages = [];
    let polly;
    let mapLanguageName = new Map();
    let params = {
    };

    function Settings(voice, engine, speakingstyle, speed, pitch) {
        this.voice = voice;
        this.engine = engine;
        this.speakingstyle = speakingstyle;
        this.speed = speed;
        this.pitch = pitch;
    }

    (async function init() {
        configAws();
        await getVoices();
        getLanguages(voices);
        fillMap();
        loadLanguages();
    })();

    function configAws() {
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:6f84d874-380c-4c90-8162-461ae3ddae9d' });
        polly = new AWS.Polly({ apiVersion: '2016-06-10' });
    };

    function getVoices() {
        return new Promise((res, rej) => {
            (function getVoicesInternal() {
                polly.describeVoices(params, (err, data) => {
                    if (err) {
                        console.log(err);
                        rej();
                    } else {
                        voices = voices.concat(data.Voices);
                        console.log(voices);
                        //if there are a lot of voices a NextToken is released from the response
                        //This NextToken is used to retrieve the remaining voices
                        while (data.NextToken != null) {
                            params.NextToken = data.NextToken;
                            getVoicesInternal();
                        }
                        res();
                    }
                })
            })();
        })
    };

    function getLanguages(voices) {
        voices.forEach((element) => {
            if (!languages.includes(element.LanguageName)) {
                languages.push(element.LanguageName);
            }
        });
    }

    function fillMap() {
        let names = [];
        languages.forEach((lang) => {
            names = voices.filter(voice => voice.LanguageName === lang);
            mapLanguageName.set(lang, names);
        });
        console.log(mapLanguageName);
    }

    function loadLanguages() {
        if (languages.length !== 0) {
            languageOptions.innerHTML = "";
            // display voices for clicked language
            languages.forEach((lang) => {
                languageOptions.innerHTML += "<option value=\"" + lang + "\">" +
                    lang + "</option>";
            });
            if(languages.includes('US English')){
                languageOptions.selectedIndex = languages.indexOf('US English');
                loadNames('US English');
            }else{
                languageOptions.selectedIndex = 0;
                loadNames(languages.at(0));
            }
            languageOptions.disabled = false;
        }
    }

    function loadNames(language) {
        voiceOptions.innerHTML = "";
        let names = mapLanguageName.get(language);
        names.forEach((element) => {
            element.SupportedEngines.forEach((engine) => {
                voiceOptions.innerHTML += "<option value=\"" + element.Name + "-" + engine + "\">" +
                    element.Name + " (" + engine + ")" + "</option>";
                names_engine.push(element.Name + '-' + engine);
            })
        })
        voiceOptions.selectedIndex = 0;
        voiceOptions.disabled = false;
    }


    document.addEventListener('click', function (event) {
        if (languages.includes(event.target.value)) {
            loadNames(event.target.value);
        }
        if(names_engine.includes(event.target.value)){
            let split = event.target.value.split('-');
            selectedVoice = split[0];
            selectedEngine = split[1];
            console.log('check');
        }


    }, false)



}