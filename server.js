const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

// Setting up storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Initializing upload variable
const upload = multer({
    storage:storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('myImage')

// Checks for the file type

function checkFileType(file,cb){
    // Possible file extensions for the file.
    const filetypes = /jpeg|png|jpg|gif/

    // Check extension names.
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    // Check mime types
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null,true)
    }else{
        cb('Error: Images only!!')
    }
}


const app = express()

// Setting up ejs
app.set('view engine','ejs')

// Setting up static folder
app.use(express.static('./public'));

app.get('/', (req,res)=>{
    res.render('index')
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg: err
            })
        }else{
            // console.log(req.file)
            if(req.file==undefined){
                res.render('index',{
                    msg : 'Error: No file selected.'
                })
            }else{
                res.render('index',{
                    msg : 'File uploaded successfully.',
                    file: `uploads/${req.file.filename}`
                })
            }
            
        }
    })
})

app.listen(3000, ()=>{
    console.log('Server started on 3000...')
})