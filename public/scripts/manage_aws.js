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
    let selectedLanguage;
    let selectedVoice;
    let selectedEngine;
    let selectedSpeed = speedSlider.value;
    let selectedPitch = pitchSlider.value;
    let selectedTimbre = timbreSlider.value;
    let voices = [];
    let names_engine = [];
    let languages = [];
    let mapLanguageName = new Map();
    let isSaved = false;

    function Settings(language, voice, engine, timbre, speed, pitch) {
        this.type = 'aws';
        this.language = language;
        this.voice = voice;
        this.engine = engine;
        this.timbre = timbre;
        this.speed = speed;
        this.pitch = pitch;
    }

    (async function initAws() {
        await getVoices();
        getLanguages(voices);
        fillMap();
        loadLanguages();
        if (savedsettings !== null && savedsettings.type.localeCompare('aws') === 0) {
            isSaved = true;
            selectedLanguage = savedsettings.language;
            selectedVoice = savedsettings.voice;
            selectedEngine = savedsettings.engine;
            selectedSpeed = invertSpeed(savedsettings.speed);
            selectedPitch = invertPitch(savedsettings.pitch);
            selectedTimbre = invertTimbre(savedsettings.timbre);
            tts.value = 'aws';
            selectService();
            setSavedSettings();
            allsettings = new Settings(selectedLanguage, selectedVoice, selectedEngine, convertTimbre(selectedTimbre), convertSpeed(selectedSpeed), convertPitch(selectedPitch));
            isSaved = false;
        }

    })();

    function setSavedSettings() {
        languageOptions.value = selectedLanguage;
        loadNames(selectedLanguage);
        voiceOptions.value = selectedVoice + '-' + selectedEngine;
        speedSlider.value = selectedSpeed;
        document.getElementById('rangevalueSpeedAws').textContent = selectedSpeed;
        pitchSlider.value = selectedPitch;
        document.getElementById('rangevaluePitchAws').textContent = selectedPitch;
        timbreSlider.value = selectedTimbre;
        document.getElementById('rangevalueTimbreAws').textContent = selectedTimbre;
    }

    async function getVoices() {
        const response = await fetch('settings/getAwsSettings');
        let info = await response.json();
        voices = info.voices;
        loadLanguages(selectedLanguage);
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
                selectedLanguage = 'US English';
                loadNames(selectedLanguage);
            } else {
                languageOptions.selectedIndex = 0;
                selectedLanguage = languages.at(0);
                loadNames(selectedLanguage);
            }
            languageOptions.disabled = false;
        }
    }

    function loadNames(language) {
        voiceOptions.innerHTML = "";
        let names = mapLanguageName.get(language);
        names.forEach((element, i) => {
            element.SupportedEngines.forEach((engine, j) => {
                if (!isSaved && i === 0 && j === 0) {
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

    function invertSpeed(percspeed) {
        let speed = Number(percspeed.split('%')[0]);
        speed = ((speed / 100) - 0.2).toFixed(2);

        return speed;
    }

    function convertTimbre(timbre) {
        let result = Math.round(((Number(timbre) - 1) * 50));
        //because timbre needs sign '+' in SSml tag for Aws
        if (result >= 0) {
            return '+' + result.toString() + '%';
        }
        return result.toString() + '%';
    }

    function invertTimbre(perctimbre) {
        let timbre = Number(perctimbre.split('%')[0]);
        timbre = ((timbre / 50) + 1).toFixed(2);
        return timbre;
    }


    document.addEventListener('click', function (event) {
        if (languages.includes(event.target.value)) {
            selectedLanguage = event.target.value;
            loadNames(selectedLanguage);
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


    allsettingsBtn.addEventListener('click', () => {
        if (tts.value === 'aws') {
            let newsettings = new Settings(selectedLanguage ,selectedVoice, selectedEngine, convertTimbre(selectedTimbre), convertSpeed(selectedSpeed), convertPitch(selectedPitch));
            modifyAllSettings(newsettings);
        }
    })

}