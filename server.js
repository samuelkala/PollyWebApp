const express = require('express');
const multer = require('multer');
const path = require('path');
const {startApp} = require('./GUI');
let file_to_download;

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

  upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log('Multer error occured');
      } else if (err) {
          // An unknown error occurred when uploading.
          console.log('Unknown error occured');
      }
      // Everything went fine. 
      next()
  })
}

//const upload = multer({storage: storage });


const app = express();

app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
 
app.post('/upload-ppt', uploadFile, startPolly, (req,res) => {
  //console.log(req.file.filename);
  if(req.file == null){
    res.send('you haven\'t upload any file');
  }else{
    //res.send(req.file.filename); 
    res.send('file uploaded successfully');
  }
  }
);

app.post('/download',(req,res) =>{
  file = req.body;
  file_to_download = './downloads/' + req.body.filename;
});


async function startPolly(req, res, next){
  await startApp(req.file.filename);
  next();
};

//start app 
const port = 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);