let lAws = document.getElementById('lAws');
let vAws = document.getElementById('vAws');
let tAws = document.getElementById('tAws');
let sAws = document.getElementById('sAws');
let pAws = document.getElementById('pAws');

let awsSettings = {
    type: "aws",
    language: "",
    voice: "",
    engine: "",
    timbre: "",
    speed: "",
    pitch: ""
};

{
    let languageOptions = document.getElementById('languageOptionsAws');
    let voiceOptions = document.getElementById('voiceOptionsAws');
    let speedSlider = document.getElementById('myRangeSpeedAws');
    let pitchSlider = document.getElementById('myRangePitchAws');
    let timbreSlider = document.getElementById('timbreRangeAws');
    let voices = [];
    let names_engine = [];
    let languages = [];
    let mapLanguageName = new Map();
    let setloadingDots = document.getElementById('setLoadDots');
    let isSaved = false;

    awsSettings.speed = convertSpeed(speedSlider.value);
    awsSettings.timbre = convertTimbre(timbreSlider.value);
    awsSettings.pitch = convertPitch(pitchSlider.value);

    (async function initAws() {
        await getVoices();
        getLanguages(voices);
        fillMap();
        if (savedsettings != null && savedsettings.type.localeCompare('aws') === 0) {
            isSaved = true;
            awsSettings.language = savedsettings.language;
            awsSettings.voice = savedsettings.voice;
            awsSettings.engine = savedsettings.engine;
            awsSettings.speed = savedsettings.speed;
            awsSettings.pitch = savedsettings.pitch;
            awsSettings.timbre = savedsettings.timbre;
            tts.value = 'aws';
            selectService();
            setSavedSettings();
            isSaved = false;
        }else{
            loadLanguages();
        }
        setloadingDots.style.display = 'none';

    })();

    function setSavedSettings() {
        loadLanguages();
        speedSlider.value = invertSpeed(awsSettings.speed);
        document.getElementById('rangevalueSpeedAws').textContent = speedSlider.value;
        pitchSlider.value = invertPitch(awsSettings.pitch);
        document.getElementById('rangevaluePitchAws').textContent = pitchSlider.value;
        timbreSlider.value = invertTimbre(awsSettings.timbre);
        document.getElementById('rangevalueTimbreAws').textContent = timbreSlider.value;
    }

    async function getVoices() {
        const response = await fetch('settings/getAwsSettings');
        let info = await response.json();
        voices = info.voices;
        
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
        languageOptions.innerHTML = "";
        // display voices for clicked language
        languages.forEach((lang) => {
            languageOptions.innerHTML += "<option value=\"" + lang + "\">" +
                lang + "</option>";
        });
        if (!isSaved) {
            let selectId;
            if (languages.includes('US English')) {
                selectId = languages.indexOf('US English');
            } else {
                selectId = 0;
            }
            awsSettings.language = languages.at(selectId);
        }
        languageOptions.value = awsSettings.language;
        languageOptions.disabled = false;
        loadNames(awsSettings.language);

    }

    function loadNames(language) {
        voiceOptions.innerHTML = "";
        let names = mapLanguageName.get(language);
        names.forEach((element, i) => {
            element.SupportedEngines.forEach((engine, j) => {
                if (!isSaved && i === 0 && j === 0) {
                    awsSettings.voice = element.Name;
                    awsSettings.engine = engine;
                }
                voiceOptions.innerHTML += "<option value=\"" + element.Name + "-" + engine + "\">" +
                    element.Name + " (" + engine + ")" + "</option>";
                names_engine.push(element.Name + '-' + engine);
            })
        })
        voiceOptions.value = awsSettings.voice + '-' + awsSettings.engine;
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
            awsSettings.language = event.target.value;
            loadNames(awsSettings.language);
        }
        if (names_engine.includes(event.target.value)) {
            let split = event.target.value.split('-');
            awsSettings.voice = split[0];
            awsSettings.engine = split[1];
            console.log('check');
        }

    }, false)

    speedSlider.addEventListener('change', () => {
        awsSettings.speed = convertSpeed(speedSlider.value);
        document.getElementById('rangevalueSpeedAws').textContent = speedSlider.value;
    })

    pitchSlider.addEventListener('change', () => {
        awsSettings.pitch = convertPitch(pitchSlider.value);
        document.getElementById('rangevaluePitchAws').textContent = pitchSlider.value;
    })

    timbreSlider.addEventListener('change', () => {
        awsSettings.timbre = convertTimbre(timbreSlider.value);
        document.getElementById('rangevalueTimbreAws').textContent = timbreSlider.value;
    })


}