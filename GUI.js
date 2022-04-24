const Fs = require('fs');


const { checkConfig } = require('./libs/manageConfig');
const { authenticate, generateAudio } = require('./libs/polly');
const { readFile } = require('./libs/readFile');
const { getPollyParams } = require('./libs/getPollyParams');
const { generateAllAudios } = require('./libs/generateAllAudios');

const { processPPTXFile } = require('./libs/processPPTXFile');

async function startApp(filename) {

    let finalConfig = null;
    
    // If configuration is not present create config.json
    try {
        finalConfig = await checkConfig('./config.json');
    }
    catch(error) {
        let config = await inquirer.prompt(configQuestions);

        let data = JSON.stringify(config);
        Fs.writeFileSync('./config.json', data);

        finalConfig = await checkConfig('./config.json');
    }

    await authenticate(finalConfig.config, finalConfig.sharedConfig.aws_pool_id);
    await processPPTXFile(filename);
}
//startApp()

module.exports = {
    startApp
}
