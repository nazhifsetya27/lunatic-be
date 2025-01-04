const { Request } = require('../../../helper')
const { Models } = require('../../../sequelize/models')
const {
  collections,
  storeData,
  removeData,
  restoreData,
  showData,
  detailData,
  updateData,
  example,
} = require('./elektronik.repository')
const uuid = require('uuid')

exports.index = async (req, res) => {
  try {
    Request.success(res, await collections(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.show = async (req, res) => {
  try {
    Request.success(res, await showData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    Request.success(res, await detailData(req))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.store = async (req, res) => {
  try {
    await storeData(req)
    Request.success(res, { message: 'Data successfully added' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.remove = async (req, res) => {
  try {
    await removeData(req)
    Request.success(res, { message: 'Data successfully removed' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.restore = async (req, res) => {
  try {
    await restoreData(req)
    Request.success(res, { message: 'Data successfully restored' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.update = async (req, res) => {
  try {
    await updateData(req)
    Request.success(res, { message: 'Data successfully updated' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.importData = async (req, res) => {
  try {
    const { assets, category } = req.body

    let socket_name = uuid.v4()
    if (!assets?.length) throw 'Data is empty'

    const startImport = async () => {
      let success = 0
      let failed = []
      let lastProgess = null

      for (let i = 0; i < assets.length; i++) {
        const element = assets[i]

        const asset = {
          name: element['Name'],
          kode: element['Kode'],
          category: element['Category'],
          quantity: element['Quantity'],
        }

        element.errors = []

        if (!asset.name) element.errors.push(`Name is required`)
        if (!asset.kode) element.errors.push(`Kode is required`)
        if (!asset.category) element.errors.push(`Category is required`)
        if (!element['Condition']) element.errors.push(`Category is required`)
        let unitName = element['Unit'].split(',')
        const unitData = await Models.Unit.findOne({
          where: {
            name: {
              [Op.iLike]: unitName[0],
            },
            code: {
              [Op.iLike]: unitName[1],
            },
          },
        })
        if (!unitData)
          element.errors.push(`Unit with value ${element['Unit']} not exist`)

        let gedungName = element['Gedung'].split(',')
        const gedungData = await Models.Building.findOne({
          where: {
            name: {
              [Op.iLike]: gedungName[0],
            },
            code: {
              [Op.iLike]: gedungName[1],
            },
          },
        })
        if (!gedungData)
          element.errors.push(
            `Gedung with value ${element['Gedung']} not exist`
          )

        let lantaiName = element['Lantai'].split(',')
        const lantaiData = await Models.Floor.findOne({
          where: {
            name: {
              [Op.iLike]: lantaiName[0],
            },
            code: {
              [Op.iLike]: lantaiName[1],
            },
          },
        })
        if (!lantaiData)
          element.errors.push(
            `Lantai with value ${element['Lantai']} not exist`
          )

        let ruanganName = element['Ruangan'].split(',')
        const ruanganData = await Models.Room.findOne({
          where: {
            name: {
              [Op.iLike]: ruanganName[0],
            },
            code: {
              [Op.iLike]: ruanganName[1],
            },
          },
        })
        if (!ruanganData)
          element.errors.push(
            `Ruangan with value ${element['Ruangan']} not exist`
          )

        const storageManagement = await Models.StorageManagement.findOne({
          where: {
            unit_id: unitData.id,
            building_id: gedungData.id,
            floor_id: lantaiData.id,
            room_id: ruanganData.id,
          },
        })

        if (!storageManagement) {
          element.errors.push(
            `the location of the inputted item does not exist`
          )
        } else {
          asset.storage_management_id = storageManagement.id
        }

        const condition = await Models.Condition.findOne({
          where: {
            name: element['Condition'],
          },
        })

        if (condition) {
          asset.condition_id = condition.id
        }

        if (!element.errors.length) success += 1
        else {
          element.errors = element.errors.join(', ')
          failed.push(element)
        }
        let progress = Math.ceil((i / assets.length) * 100)

        if (lastProgess != progress) {
          lastProgess = progress
          io.of('/v1').emit('upload-' + socket_name, {
            progress: progress,
          })
        }

        const whereAssetProperty = {
          name: asset.name,
          kode: asset.kode,
          kode: asset.category,
        }
        if (category) whereAssetProperty.category = category

        if (!element.errors.length) {
          const [newAsset, created] = await Models.Asset.findOrCreate({
            defaults: asset,
            where: whereAssetProperty,
            req,
          })
          if (!created) {
            await newAsset.update(asset, { req })
          }
        }
      }

      console.log('Success : ', success)
      console.log('Failed : ', failed.length)

      io.of('/v1').emit('upload-' + socket_name, {
        progress: 100,
      })
      setTimeout(() => {
        io.of('/v1').emit('result-' + socket_name, {
          result: { success, failed },
        })
      }, 1000)
    }

    startImport().catch(console.error)
    Request.success(res, {
      message: 'Success import data',
      data: {
        progress: 'upload-' + socket_name,
        result: 'result-' + socket_name,
      },
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.example = async (req, res) => {
  try {
    await example(req, res)
  } catch (error) {
    Request.error(res, error)
  }
}
