const multer = require('multer')

const uploadFile = (imageFile, videoFile) => {
  /**
   *  init multer diskstorage
   *  determine destination file upload
   *  rename file (so that not nothing same)
  */
  const fileName = ''
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './uploads')
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''))
    }
  })

  /**
   *  filter file by type
   *  allowed extension file (jpg, png, jpeg)
   */
  const fileFilter = (req, file, callback) =>  {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed'
        }
        return callback(new Error('Only image files are allowed'), false)
      }
    }
    if (file.fieldname === videoFile) {
      if (!file.originalname.match(/\.(mp4|mkv)$/)) {
        req.fileValidationError = {
          message: 'Only video file are allowed'
        }
        return callback(new Error('Only video files are allowed'))
      }
    }
    callback(null, true)
  }
  const sizeInMB = 100
  const maxSize = sizeInMB * 1000 * 1000

  /**
   *  execute upload multer and determine disk storage, validation and max size
   */
  const upload = multer({ storage, fileFilter, limits: {
      fileSize: maxSize
    }
  }).fields([
    {
      name: imageFile,
      maxCount: 1
    },
    {
      name: videoFile,
      maxCount: 1
    }
  ])

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.status(400).send({
          status: 'failed',
          ...req.fileValidationError
        })
      }
      // if (!req.files && !err) {
      //   return res.status(401).send({
      //     status: 'failed',
      //     message: 'Please select file to upload'
      //   })
      // }
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            status: failed,
            message: 'Oversize file upload'
          })
        }
        console.log(err.message)
        return res.status(400).send({
          status: 'failed',
          message: err.message
        })
      }
      return next()
    })
  }
}

module.exports = uploadFile
