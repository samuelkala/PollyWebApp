const { processPPTXFile } = require('./libs/processPPTXFile');

async function startApp(filename, settings) {
    await processPPTXFile(filename, settings);
}

module.exports = {
    startApp
}
