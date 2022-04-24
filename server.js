const express = require('express')
const multer = require('multer')
const path = require('path')
const {startApp} = require('./GUI')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({storage: storage })


const app = express()

app.use(express.static('public'))
 
app.post('/upload-ppt',upload.single('file1'),startPolly,(req,res) => {
  console.log(req.file.filename);
  res.send('file uploaded succesfully');

})

app.get('/download',(req,res) =>{
  res.download('uploads/1650810461247-982714072.pptx');
})

function startPolly(req, res, next){

  startApp(req.file.filename);
  next();
} 

//start app 
const port = 3000

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);