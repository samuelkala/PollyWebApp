{
    let languageOptions = document.getElementById('languageOptionsAws');
    let voiceOptions = document.getElementById('voiceOptionsAws');
    let speedSlider = document.getElementById('myRangeSpeedAws');
    let pitchSlider = document.getElementById('myRangePitchAws');
    let timbreSlider = document.getElementById('timbreRangeAws');
    let selectedVoice;
    let selectedEngine;
    let selectedSpeed;
    let selectedPitch;
    let selectedTimbre;
    let voices = [];
    let names_engine = [];
    let languages = [];
    let polly;
    let mapLanguageName = new Map();
    let params = {
    };

    function Settings(voice, engine, timbre, speed, pitch) {
        this.type = 'aws';
        this.voice = voice;
        this.engine = engine;
        this.timbre = timbre;
        this.speed = speed;
        this.pitch = pitch;
    }

    (async function init() {
        configAws();
        await getVoices();
        getLanguages(voices);
        fillMap();
        loadLanguages();
        console.log(hello);
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


    function convertSpeed(speed) {
        let n_speed = Number(speed);
        if(n_speed < 1.2){
            return '20%';
        }
        return Math.round(((n_speed - 1) * 100)).toString() + '%';
    }

    function convertPitch(pitch) {
        return Math.round(((Number(pitch) - 1) * 50)).toString() + '%';
    }

    function convertTimbre(timbre) {
        let result = Math.round(((Number(timbre) - 1) * 50)).toString() + '%';
        //because timbre needs sign in SSml tag for Aws
        if(result > 0){
            return '+' + result;
        }
        return result;
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

    speedSlider.addEventListener('change', () => {
        selectedSpeed = speedSlider.value;
        document.getElementById('rangevalueSpeedAws').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', () => {
        selectedPitch = pitchSlider.value;
        document.getElementById('rangevaluePitchAws').textContent = pitchSlider.value;
    })

    timbreSlider.addEventListener('change', () => {
        selectedTimbre = timbreSlider.value;
        document.getElementById('rangevalueTimbreAws').textContent = timbreSlider.value;
    })

}