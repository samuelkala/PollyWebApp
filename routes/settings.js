const express = require('express');
const path = require('path');
const axios = require('axios');
const pino = require('express-pino-logger')();
const cors = require('cors');
const { startApp } = require('../startPolly');
const router = express.Router();
const AWS = require('aws-sdk');

router.use(pino);
router.use(cors());

router.get('/',(req, res) => {
    res.sendFile(path.join(__dirname , '..' , 'public' ,'settings.html'));
});

router.post('/getconvparams', startPolly, (req, res) => {
    res.status(200).send({message: 'Convertion terminated successfully'});
});

//this token will be sent to the client who will retrieve all the available voices
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
        res.status(401);
    }
});


router.get('/getAwsSettings', async(req, res) => {
    try{
        const Polly = new AWS.Polly({
            signatureVersion: 'v4',
            region: 'us-east-1'
        })
        let voices = await getVoices(res,Polly);
        let to_send = {
            voices: voices
        }
        res.send(JSON.stringify(to_send));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
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


function getVoices(res,Polly) {
    let voices = [];
    let params = {};
    return new Promise((resolve, reject) => {
        (function getVoicesInternal() {
            Polly.describeVoices(params, (err, data) => {
                if (err) {
                    console.log(err);
                    reject();
                } else {
                    voices = voices.concat(data.Voices);
                    //if there are a lot of voices a NextToken is released from the response
                    //This NextToken is used to retrieve the remaining voices
                    while (data.NextToken != null) {
                        params.NextToken = data.NextToken;
                        getVoicesInternal();
                    }
                    resolve(voices);
                }
            })
        })();
    })
};


module.exports = router;