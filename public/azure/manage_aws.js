let lAws = document.getElementById('lAws');
let vAws = document.getElementById('vAws');
let tAws = document.getElementById('tAws');
let sAws = document.getElementById('sAws');
let pAws = document.getElementById('pAws');


{
    let languageOptions = document.getElementById('languageOptionsAws');
    let voiceOptions = document.getElementById('voiceOptionsAws');
    let speedSlider = document.getElementById('myRangeSpeedAws');
    let pitchSlider = document.getElementById('myRangePitchAws');
    let timbreSlider = document.getElementById('timbreRangeAws');
    let selectedVoice;
    let selectedEngine;
    let selectedSpeed = speedSlider.value;
    let selectedPitch = pitchSlider.value;
    let selectedTimbre = timbreSlider.value;
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

    (async function initAws() {
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
            if (languages.includes('US English')) {
                languageOptions.selectedIndex = languages.indexOf('US English');
                loadNames('US English');
            } else {
                languageOptions.selectedIndex = 0;
                loadNames(languages.at(0));
            }
            languageOptions.disabled = false;
        }
    }

    function loadNames(language) {
        voiceOptions.innerHTML = "";
        let names = mapLanguageName.get(language);
        names.forEach((element, i) => {
            element.SupportedEngines.forEach((engine, j) => {
                if (i === 0 && j === 0) {
                    selectedVoice = element.Name;
                    selectedEngine = engine;
                }
                voiceOptions.innerHTML += "<option value=\"" + element.Name + "-" + engine + "\">" +
                    element.Name + " (" + engine + ")" + "</option>";
                names_engine.push(element.Name + '-' + engine);
            })
        })
        voiceOptions.disabled = false;
    }


    function convertSpeed(speed) {
        let n_speed = Number(speed);
        return Math.round((n_speed + 0.2) * 100).toString() + '%';

    }

    function convertTimbre(timbre) {
        let result = Math.round(((Number(timbre) - 1) * 50)).toString() + '%';
        //because timbre needs sign '+' in SSml tag for Aws
        if (result >= 0) {
            return '+' + result;
        }
        return result;
    }


    document.addEventListener('click', function (event) {
        if (languages.includes(event.target.value)) {
            loadNames(event.target.value);
        }
        if (names_engine.includes(event.target.value)) {
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

    settingsBtn.addEventListener('click', () => {
        if (tts.value === 'aws') {
            let modifiedSettings = new Settings(selectedVoice, selectedEngine, convertTimbre(selectedTimbre), convertSpeed(selectedSpeed), convertPitch(selectedPitch));
            modifySettings(allsettings, modifiedSettings, selectedSlide);
            console.log('check if the selected slide has been modified');
        }
    })

    allsettingsBtn.addEventListener('click', () => {
        if (tts.value === 'aws') {
            let settingsAllSlides = new Settings(selectedVoice, selectedEngine, convertTimbre(selectedTimbre), convertSpeed(selectedSpeed), convertPitch(selectedPitch));
            modifyAllSettings(allsettings, settingsAllSlides);
        }
    })

}