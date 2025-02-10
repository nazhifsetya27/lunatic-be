const { Op, Sequelize } = require('sequelize')
const { Models } = require('../../sequelize/models')

const { StorageManagement } = Models
const { sequelize } = StorageManagement

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const { unit_id } = req.params
  const numberPage = Number(page)

  if (!unit_id) throw 'unit_id is required!'

  const where = { [Op.and]: [{ unit_id }] }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
    attributes: [
      [Sequelize.fn('MAX', Sequelize.col('storage_managements.id')), 'id'],
      [
        Sequelize.fn('MAX', Sequelize.col('storage_managements.created_at')),
        'created_at',
      ],
      [Sequelize.fn('MAX', Sequelize.col('unit.id')), 'unitId'],
      [Sequelize.fn('MAX', Sequelize.col('unit.name')), 'unitName'],
      [
        Sequelize.fn(
          'count',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_floor.id'))
        ),
        'floor',
      ],
      [
        Sequelize.fn(
          'array_agg',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_floor.id'))
        ),
        'floorIds',
      ],
      [
        Sequelize.fn(
          'array_agg',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_floor.name'))
        ),
        'floorNames',
      ],
      [
        Sequelize.fn(
          'count',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_room.id'))
        ),
        'room',
      ],
      [
        Sequelize.fn(
          'array_agg',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_room.id'))
        ),
        'roomIds',
      ],
      [
        Sequelize.fn(
          'array_agg',
          Sequelize.fn('DISTINCT', Sequelize.col('storage_room.name'))
        ),
        'roomNames',
      ],
    ],
    include: [
      {
        paranoid: false,
        association: 'unit',
        attributes: [], // Attributes are aggregated in the main query
      },
      {
        paranoid: false,
        association: 'building',
        attributes: ['id', 'name'], // Grouped attributes
      },
      {
        paranoid: false,
        association: 'storage_floor',
        attributes: [], // Attributes are aggregated in the main query
      },
      {
        paranoid: false,
        association: 'storage_room',
        attributes: [], // Attributes are aggregated in the main query
      },
    ],
    group: ['building.id', 'building.name'], // Group by only building fields
  }

  const data = await StorageManagement.findAndCountAll(query)
  const total = data.count.length
  const totalPage = Math.ceil(total / page_size)
  let uniqueChildren = []

  // get the storage hierarcy that exist on a unit, to view in column header
  await Promise.all(
    data.rows.map((value) => {
      // Rename 'building' to 'Gedung'
      if (value.dataValues.building) {
        value.dataValues.Gedung = value.dataValues.building
        delete value.dataValues.building
      }
      if (value.dataValues.floor) {
        value.dataValues.Lantai = value.dataValues.floor
        delete value.dataValues.floor
      }
      if (value.dataValues.room) {
        value.dataValues.Ruangan = value.dataValues.room
        delete value.dataValues.room
      }

      const isFloorContainId = value.dataValues.floorIds.map(
        (val) => val !== null
      )
      const isRoomContainId = value.dataValues.roomIds.map(
        (val) => val !== null
      )

      if (
        value.building &&
        isFloorContainId.includes(true) &&
        isRoomContainId.includes(true)
      ) {
        uniqueChildren.push('Gedung', 'Lantai', 'Ruangan')
      } else if (value.building && isFloorContainId.includes(true)) {
        uniqueChildren.push('Gedung', 'Lantai')
      } else if (value.building) {
        uniqueChildren.push('Gedung')
      }
    })
  )

  // make uniqueChildren return only unique value
  const hierarchy = ['Gedung', 'Lantai', 'Ruangan']
  uniqueChildren = Array.from(
    new Set(uniqueChildren.filter((item) => hierarchy.includes(item)))
  ).sort((a, b) => hierarchy.indexOf(a) - hierarchy.indexOf(b))

  return {
    data: data.rows,
    uniqueChildren,
    meta: {
      current_page: numberPage,
      prev_page: numberPage === 1 ? null : numberPage - 1,
      next_page:
        numberPage === totalPage || total <= totalPage ? null : numberPage + 1,
      total_page: totalPage || 1,
      total,
    },
    // filter: [],
  }
}

exports.showData = async (req) => {
  const { unit_id, id } = req.params
  // logic show -> kalo ada bulding, show floor, kalo floor show room

  if (!unit_id) throw new Error('unit_id is required!')
  if (!id) throw new Error('id is required!')

  const data = await Models.StorageManagement.findAll({
    where: {
      unit_id,
      [Op.or]: [{ building_id: id }, { floor_id: id }, { room_id: id }],
    },
    paranoid: false,
    include: [
      {
        paranoid: false,
        association: 'building',
        attributes: ['id', 'name'],
      },
      {
        paranoid: false,
        association: 'storage_floor',
        attributes: ['id', 'name'],
      },
      {
        paranoid: false,
        association: 'storage_room',
        attributes: ['id', 'name'],
      },
    ],
  })
  if (data.length < 1) throw 'Data not found'

  const matches = data.map((record) => {
    if (record.building_id === id) return 'building_id'
    if (record.floor_id === id) return 'floor_id'
    if (record.room_id === id) return 'room_id'
    return 'no_match' // fallback if no match is found in an edge case
  })

  let formattedData
  let category

  switch (matches[0]) {
    case 'building_id':
      formattedData = data.map((val) => val?.dataValues?.storage_floor)
      category = 'Lantai'
      // To Do: menampilkan isi ruangan dari lantai
      // const containRoom = data.map((val) => val?.dataValues?.storage_room)
      // const totalRoom = containRoom.filter((item) => item !== null).length
      // console.log(formattedData)

      // formattedData.push({ totalRoom })
      break
    case 'floor_id':
      formattedData = data.map((val) => val?.dataValues?.storage_room)
      category = 'Ruangan'
      break
    default:
      break
  }

  // make value returned is unique.
  return {
    raw: data,
    data: [
      ...new Map(
        formattedData
          .filter((item) => item !== null) // Remove null entries
          .map((item) => [item.id, item]) // Use `id` as the key for uniqueness
      ).values(), // Extract unique items
    ].sort((a, b) => (a.name > b.name ? 1 : -1)), // Sort by `name` in ascending order
    category,
  }
}

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    // current_building_id indicates that this is update floor
    // current_floor_id indicates that this is update room
    const {
      unit_id,
      building_ids,
      floor_ids,
      room_ids,
      current_building_id,
      current_floor_id,
    } = req.body

    // Build the where clause dynamically based on the provided fields
    const whereClause = {
      unit_id,
      ...(building_ids &&
        building_ids.length > 0 && { building_id: { [Op.in]: building_ids } }),
      ...(floor_ids &&
        floor_ids.length > 0 && { floor_id: { [Op.in]: floor_ids } }),
      ...(room_ids &&
        room_ids.length > 0 && { room_id: { [Op.in]: room_ids } }),
      // ...(floor_id && { floor_id }),
      // ...(room_id && { room_id }),
    }

    if (current_building_id) whereClause.building_id = current_building_id

    console.log('room_ids: ', room_ids)
    console.log('current_building_id: ', current_building_id)
    console.log('current_floor_id: ', current_floor_id)

    // throw 'yahaha'

    if (building_ids) {
      await Promise.all(
        building_ids.map(async (building_id) => {
          const [storageManagement, created] =
            await StorageManagement.findOrCreate({
              where: whereClause,
              defaults: {
                unit_id,
                building_id: building_id || null,
                // floor_id: floor_id || null,
                // room_id: room_id || null,
              },
              transaction,
            })

          return { storageManagement, created }
        })
      )
    } else if (floor_ids) {
      await Promise.all(
        floor_ids.map(async (floor_id) => {
          const [storageManagement, created] =
            await StorageManagement.findOrCreate({
              where: whereClause,
              defaults: {
                unit_id,
                building_id: current_building_id || null,
                floor_id: floor_id || null,
                // room_id: room_id || null,
              },
              transaction,
            })

          return { storageManagement, created }
        })
      )
    } else if (room_ids) {
      await Promise.all(
        room_ids.map(async (room_id) => {
          const [storageManagement, created] =
            await StorageManagement.findOrCreate({
              where: whereClause,
              defaults: {
                unit_id,
                building_id: current_building_id || null,
                floor_id: current_floor_id || null,
                room_id: room_id || null,
              },
              transaction,
            })

          return { storageManagement, created }
        })
      )
    }
  })

  return { data }
}

exports.removeData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const { storage_management_id } = req.params
    console.log('storage_management_id: ', storage_management_id)

    const storagemanagement = await Models.StorageManagement.findOne({
      where: { id: storage_management_id },
      paranoid: false,
      transaction,
    })

    if (!storagemanagement) throw new Error('storagemanagement not found')

    await storagemanagement.destroy({ req, transaction, force: true })
  })
}
