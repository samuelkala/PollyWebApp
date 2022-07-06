const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const settingsRouter = require('./routes/settings');
const port = 3000;
const app = express();
require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());
app.use('/settings', settingsRouter);
app.use(bodyParser.urlencoded({ extended: true }));


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'SharedFolder/pptx/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); //Appending extension
  }
})


function uploadFile(req, res, next) {
  const upload = multer({ storage: storage }).single('myFile');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('Multer error occured:');
      console.log(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('Unknown error occured');
    }
    // Everything went fine. 
    next();
  })
}

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.post('/upload-ppt', uploadFile, (req, res) => {
  if (req.file == null) {
    res.sendStatus(500);
  } else {
    let to_send = {
      file_to_download: req.file.filename
    }
    res.send(JSON.stringify(to_send));
  }
}
)


app.post('/download', (req, res) => {
  let file_to_download = './downloads/' + req.body.dwnFile;
  res.download(file_to_download, (err) => {
    if (err) {
      res.sendStatus(404);
    } 
    try{
      fs.unlinkSync(file_to_download);
    }catch(e){
      console.log('file to download not found');
    } 
  });
})


app.listen(port, () => {
  console.log('App is listening on port ' + `${port}`);
})