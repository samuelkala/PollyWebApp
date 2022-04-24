const express = require('express')
const multer = require('multer')
const path = require('path')

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
 
app.post('/upload-ppt',upload.single('file1'),(req,res) => {
  var filename = multer.diskStorage.filename
  console.log(filename)
  res.send('file uploaded succesfully')
})

app.get('/download',startPolly,(req,res) =>{
  res.download('uploads/1650810461247-982714072.pptx')
})

function startPolly(){
  


}

//start app 
const port = 3000

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);