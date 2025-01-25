const uuid = require('uuid')
const sharp = require('sharp')
const fs = require('fs')
const Jimp = require('jimp')
const path = require('path')
const { Request } = require('./request')

exports.checkFile =
  ({ name, required, allow = [], multi = false }) =>
  (req, res, next) => {
    const validate = (file, index) => {
      if (req.files && file) {
        // console.log('chris: ', req.files)

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
        } else {
          req.file[name] = file
          // console.log('ambarawa', req.file[name])
        }
      } else if (required)
        throw {
          type: 'field',
          path: name,
          value: null,
          msg: `Field ${name} is required`,
          location: 'files',
        }
    }
    const scanForSuspiciousContent = (base64Data) => {
      // Decode base64 content
      const content = Buffer.from(base64Data, 'base64').toString('utf8')

      // Define suspicious patterns
      const suspiciousPatterns = [
        /<script\b[^>]*>([\s\S]*?)<\/script>/gm, // Detects <script> tags, which are commonly used for XSS attacks by injecting JavaScript into the page.
        /\b(eval|document\.write|window\.location|cookie)\b/gm, // Detects the use of JavaScript functions and properties often associated with malicious scripts, such as eval, document.write, window.location, and cookie.
        /<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gm, // Detects <iframe> tags, which can be used for malicious purposes, such as embedding unauthorized content or phishing.
        /on\w+=['"]?javascript:/gm, // Detects inline JavaScript in HTML attributes (e.g., onclick="javascript:..."), which can be used for XSS attacks.
        /<link[^>]+rel=["']?stylesheet["']?[^>]*>/gm, // Detects external stylesheet links, which could potentially link to malicious external resources.
        /\b(SELECT|INSERT|DELETE|UPDATE|DROP|EXEC|UNION|--|#)\b/gim, // Detects common SQL keywords that may indicate SQL injection attempts, such as SELECT, INSERT, DELETE, etc.
        /\b(or|and)\b\s*\d+\s*=\s*\d+/gm, // Detects logical conditions used in SQL injection, such as "OR 1=1" or "AND 1=1".
        /['"];\s*(?:shutdown|drop|alter|create|truncate|exec)/i, // Detects SQL commands that can be used for destructive actions, such as shutting down, altering, or dropping tables.
      ]

      // Check each pattern against the content
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          console.error(`Suspicious content found in the file`)
          // throw new Error("Suspicious content found in the file");
          throw {
            type: 'field',
            path: name,
            value: 'binary',
            msg: `Suspicious content found in the file ${name}`,
            location: 'files',
          }
        }
      }

      console.log('File content appears safe')
    }
    const myConvert = (myFile) => {
      // const myFile = req.body[name];
      // Check if the file is Base64 encoded
      if (!myFile || !myFile.startsWith('data:')) {
        console.error('Invalid file format')
        return null
      }

      // Extract the MIME type and Base64 data
      const matches = myFile.match(/^data:(.+);base64,(.+)$/)
      if (!matches) {
        console.error('Invalid Base64 format')
        return null
      }
      const mimeType = matches[1]
      const base64Data = matches[2]

      scanForSuspiciousContent(base64Data)

      const buffer = Buffer.from(base64Data, 'base64')

      // var ext = mime.extension(mimeType)
      // fs.writeFile(`public/uploads/temp/${uuid.v4()}.${ext}`, buffer, (err) => {
      //   if (err) {
      //     console.error('Error saving file:', err);
      //     return;
      //   }
      //   console.log('File saved successfully to:', filePath);
      // });
      // Get the file extension from the MIME type
      const ext = mime.extension(mimeType) || 'bin' // Default to "bin" if unknown
      const allowedExt = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'xls',
        'xlsx',
        'csv',
        'doc',
        'docx',
        'ppt',
        'pptx',
        'pdf',
        'bin',
      ]
      if (!allowedExt.includes(ext)) {
        console.error(`File ${name} extension is not allowed`)

        throw {
          type: 'field',
          path: name,
          value: 'binary',
          msg: `File ${name} extension is not allowed`,
          location: 'files',
        }
      }
      const filePath = `public/uploads/temp/${uuid.v4()}.${ext}`

      // Ensure the upload directory exists
      const uploadDir = path.dirname(filePath)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Write the file to the specified directory
      fs.writeFileSync(filePath, buffer)

      // Simulate a multer-like object
      const multerLikeFile = {
        fieldname: 'file',
        originalname: `upload.${mimeType.split('/')[1]}`, // Set a file extension
        encoding: '7bit',
        mimetype: mimeType,
        size: buffer.length,
        path: filePath,
        buffer,
      }

      req.file = { [name]: multerLikeFile }
      return multerLikeFile
    }
    try {
      if (!multi) {
        var file = null
        if (req.body[name]) {
          file = myConvert(req.body[name])
          // console.log('1 jalan')
        }
        if (req.files) {
          file = req.files?.find((e) => e.fieldname === name)
          // console.log('2 jalan')
          // console.log('brahmana: ', req.files)
        }
        if (file) validate(file)
      } else {
        // console.log('3 jalan')

        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i]
          validate(file, i)
        }
      }
      next()
    } catch (error) {
      if (file?.path) fs.unlinkSync(file?.path)
      console.error(`error upload`, error)
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
      // console.log('path: ', file.path)
      if (file)
        readXlsxFile(file.path).then((rows) => {
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
          // console.log(newData[0])
          req.body[name] = newData
          // console.log(
          //   req.body[name].find((e) => e),
          //   name
          // )
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
