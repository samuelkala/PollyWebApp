const express = require('express');
const axios = require('axios');
const pino = require('express-pino-logger')();
const cors = require('cors');

const router = express.Router();

router.use(pino);
router.use(cors());

router.get('/', (req, res) => {
    res.send('azure convertion')
});

router.post('/getconvparams', (req, res) => {

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

module.exports = router;