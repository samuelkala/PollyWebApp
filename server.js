require('dotenv').config();


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {startApp} = require('./GUI');
const bodyParser = require('body-parser');
const azureRouter = require('./routes/azure');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'SharedFolder/pptx/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); //Appending extension
  }
})

//TO DO
//Check if file extension is pptx or ppt

function uploadFile(req, res, next) {
  const upload = multer({storage: storage}).single('myFile');
  
  //single('myFile');

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
      next()
  })
}

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use('/azure_convert',azureRouter);
app.use(bodyParser.urlencoded({extended: true}));
 
app.post('/upload-ppt', uploadFile, startPolly, (req,res) => {
  //console.log(req.file.filename);
  if(req.file == null){
    res.sendStatus(400).send('error while uploading the file!');
  }else{
    res.send(JSON.stringify(req.file.filename)); 
  }
  }
);

app.post('/download',(req,res) =>{
  let file_to_download = './downloads/' + req.body.dwnFile;
  res.download(file_to_download, (err) =>{
    if(err){
      res.sendStatus(400).send('Error during Download');
    }
    fs.unlinkSync(file_to_download);
  });
});


async function startPolly(req, res, next){
  if(req.file != null){
    if(req.file.filename != null){
      await startApp(req.file.filename);
    }
  }
  next();
};


//start app 
const port = 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);