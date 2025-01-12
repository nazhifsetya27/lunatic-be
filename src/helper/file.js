const uuid = require('uuid')
const sharp = require('sharp')
const fs = require('fs')
const Jimp = require('jimp')
const { Request } = require('./request')

exports.checkFile =
  ({ name, required, allow = [], multi = false }) =>
  (req, res, next) => {
    // console.log('file ori: ', req.files)

    const validate = (file) => {
      if (req.files && file) {
        const { mimetype } = file
        if (allow.length !== 0) {
          const valid = allow.find((e) => mimetype.includes(e))
          if (!valid)
            throw {
              type: 'field',
              path: name,
              value: null,
              msg: `Not supported file extension`,
              location: 'files',
            }
        }
        if (!req.file) req.file = {}
        if (multi) {
          if (!req.file[name]) req.file[name] = []
          if (file.fieldname.includes(name)) req.file[name].push(file)
        } else req.file[name] = file
      } else if (required)
        throw {
          type: 'field',
          path: name,
          value: null,
          msg: `Field ${name} is required`,
          location: 'files',
        }
    }

    try {
      if (!multi) {
        var file = req.files?.find((e) => e.fieldname === name)
        validate(file)
      } else {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i]
          validate(file, i)
        }
      }
      next()
    } catch (error) {
      if (file?.path) fs.unlinkSync(file?.path)
      res.status(400).send({
        status: 400,
        message: 'Bad Request',
        errors: [error],
      })
    }
  }

exports.readFileExcel = (name) => (req, res, next) => {
  const readXlsxFile = require('read-excel-file/node')
  const fs = require('fs')
  try {
    if (req.file) {
      const file = req.file[name]
      console.log(file)
      if (file)
        readXlsxFile(file.path).then((rows) => {
          console.log(rows.length)
          const column = rows.splice(0, 1)[0]
          const datas = rows.filter((e) => e[0])
          const newData = datas.map((row) => {
            const rowAsObject = {}
            row.map((cell, index) => {
              rowAsObject[column[index]] = cell ? `${cell}` : null
            })
            return rowAsObject
          })
          fs.unlinkSync(file.path)
          console.log(newData[0])
          req.body[name] = newData
          console.log(
            req.body[name].find((e) => e),
            name
          )
          next()
        })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    Request.error(res, error)
  }
}

const saveImage = async (file, name, dir) => {
  if (!file) throw 'Image is empty'

  try {
    // Generate paths and filenames
    const tempPath = `public/uploads/temp/${file.originalname}-${uuid.v4()}`
    const { mimetype, buffer } = file
    const ext = mimetype.split('/')[1]
    name = name?.replace(/\W/g, '-') || new Date().getTime().toString()
    const imageDir = `public/uploads/images/${dir}`
    const finalFilename = `${name}.${ext}`
    const savePath = `${imageDir}/${finalFilename}`

    console.log(savePath, '<<<')

    // Save the file buffer to tempPath
    fs.writeFileSync(tempPath, buffer)

    // Process the image using Sharp
    await sharp(tempPath)
      .rotate() // Automatically rotate based on EXIF orientation
      .withMetadata(false)
      .toFile(savePath)

    // Delete the original uploaded temp file
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error('Error deleting original temp file:', err)
      } else {
        console.log('Original temp file deleted successfully.')
      }
    })

    // Ensure the directory exists
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true })
    }

    // Process the image further with Jimp
    // const image = await Jimp.read(tempPath)
    // await image.quality(60).writeAsync(savePath)

    // Remove the temporary file created by Sharp
    fs.unlinkSync(tempPath)

    return savePath.replace('public/', '')
  } catch (err) {
    console.error('Error processing the image:', err)
    throw 'Error processing the image'
  }
}

exports.saveImage = saveImage
