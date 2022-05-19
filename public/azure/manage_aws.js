{
    let languageOptions = document.getElementById('languageOptionsAws');
    let voiceOptions = document.getElementById('voiceOptionsAws');
    let voices = [];
    let languages = [];
    let polly;
    let mapLanguageName = new Map();
    let params = {
    };

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
        }
    }





}