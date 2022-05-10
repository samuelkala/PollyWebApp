const express = require('express');
const axios = require('axios');
const pino = require('express-pino-logger')();
const cors = require('cors');
const { startApp } = require('../startPolly');
const router = express.Router();

router.use(pino);
router.use(cors());

router.get('/', (req, res) => {
    res.send('azure convertion')
});

router.post('/getconvparams', startPolly, (req, res) => {
    let settings = [];
    settings = req.body.settings;

    /* for(let i = 0; i < settings.length; i++){
        console.log(settings[0]);
    } */
    settings.forEach((element) => {
        console.log(element.voice);
    });

    console.log(req.body.file_to_download);
    //console.log(settings);
});

router.get('/api/get-speech-token', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;
    const headers = { 
        headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }; 

    try {
        const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
        res.send({ token: tokenResponse.data, region: speechRegion });
    } catch (err) {
        res.status(401).send('There was an error authorizing your speech key.');
    }
});


async function startPolly(req, res, next) {
    if (req.body != null) {
      if (req.body.settings != undefined && req.body.file_to_download != undefined) {
        await startApp(req.body.file_to_download,req.body.settings);
      }
    }
    next();
  }


module.exports = router;