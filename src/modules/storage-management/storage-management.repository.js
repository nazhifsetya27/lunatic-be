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

  //   if (archive === '1') {
  //     where.deleted_at = { [Op.not]: null }
  //     query.paranoid = false
  //   } else if (archive === '2') {
  //     where.deleted_at = { [Op.is]: null }
  //   }

  const data = await StorageManagement.findAndCountAll(query)
  const total = data.count
  const totalPage = Math.ceil(total / page_size)
  const uniqueChildren = []

  // get the storage hierarcy that exist on a unit, to view in column header
  await Promise.all(
    data.rows.map((value) => {
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
        if (uniqueChildren.length === 0) {
          uniqueChildren.push('building', 'floor', 'room')
        }
      } else if (value.building && isFloorContainId.includes(true)) {
        if (uniqueChildren.length === 0) {
          uniqueChildren.push('building', 'floor')
        }
      } else if (value.building) {
        if (uniqueChildren.length === 0) {
          uniqueChildren.push('building')
        }
      }
    })
  )

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

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { unit_id, building_ids, floor_id, room_id } = req.body

    // Build the where clause dynamically based on the provided fields
    const whereClause = {
      unit_id,
      ...(building_ids &&
        building_ids.length > 0 && { building_id: { [Op.in]: building_ids } }),
      ...(floor_id && { floor_id }),
      ...(room_id && { room_id }),
    }

    await Promise.all(
      building_ids.map(async (building_id) => {
        const [storageManagement, created] =
          await StorageManagement.findOrCreate({
            where: whereClause,
            defaults: {
              unit_id,
              building_id: building_id || null,
              floor_id: floor_id || null,
              room_id: room_id || null,
            },
            transaction,
          })

        return { storageManagement, created } // "created" indicates if a new row was created
      })
    )
  })

  return { data }
}

/* v2 */
// exports.storeData = async (req) => {
//   const data = await sequelize.transaction(async (transaction) => {
//     const { unit_id, building_ids, floor_id, room_id } = req.body

//     // Build the where clause dynamically based on the provided fields
//     const whereClause = {
//       unit_id,
//       ...(building_ids &&
//         building_ids.length > 0 && { building_id: { [Op.in]: building_ids } }),
//       ...(floor_id && { floor_id }),
//       ...(room_id && { room_id }),
//     }

//     // Use only the first building_id from the array for defaults
//     const defaultBuildingId =
//       Array.isArray(building_ids) && building_ids.length > 0
//         ? building_ids[0]
//         : null

//     const [storageManagement, created] = await StorageManagement.findOrCreate({
//       where: whereClause,
//       defaults: {
//         unit_id,
//         building_id: defaultBuildingId,
//         floor_id: floor_id || null,
//         room_id: room_id || null,
//       },
//       transaction,
//     })

//     return { storageManagement, created } // "created" indicates if a new row was created
//   })

//   return { data }
// }
