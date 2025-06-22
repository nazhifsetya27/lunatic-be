const { Op } = require("sequelize")
const Asset = require("../../sequelize/models/asset")

exports.kodeList = async (req, res) => {
  try {
    const { search, category } = req.query
    const { user } = req

    const where = {
      [Op.and]: [
        ...(user?.unit?.id ? [{ '$storage.unit.id$': user.unit.id }] : []),
      ],
    }
    const defaultPrefixCode = [
      { name: 'Furniture', kode: 'F1' },
      { name: 'Elektronik', kode: 'E1' },
      { name: 'Umum', kode: 'U1' },
    ]

    // Validate category or use first default as fallback
    const validatedCategory = defaultPrefixCode.some(
      (item) => item.name === category
    )
      ? category
      : defaultPrefixCode[0].name

    console.log('validatedCategory: ', validatedCategory)

    if (validatedCategory) {
      where[Op.and].push({ category: validatedCategory })
    }


    if (search) {
      where[Op.and].push({
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
        ],
      })
    }

    const assetData = await Asset.findAll({
      where,
      attributes: ['id', 'name', 'category', 'kode'],
      order: [['name', 'asc']],
      include: [
        {
          association: 'storage',
          include: [
            {
              paranoid: false,
              association: 'unit',
              attributes: ['id', 'name'],
            },
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
        },
      ],
      raw: true,
    })
    console.log('assetData: ', assetData)

    // Get relevant codes
    let arrayCode
    if (!assetData.length) {
      console.log('belum ada data sebelumnya')

      const defaultEntry =
        defaultPrefixCode.find((item) => item.name === validatedCategory) ||
        defaultPrefixCode[0] // Fallback to first default
      arrayCode = [defaultEntry.kode]
    } else {
      console.log('sudah ada data sebelumnya')

      arrayCode = assetData.map((val) => val.kode).filter(Boolean)
      console.log('arrayCode: ', arrayCode)
    }
    console.log('arrayCode: ', arrayCode)

    // Fallback if codes are still empty
    if (!arrayCode.length) {
      arrayCode = [defaultPrefixCode[0].kode]
    }

    // Extract prefix and number safely
    const firstCode = arrayCode[0] || 'U1' // Final fallback
    const prefix = firstCode.slice(0, 1)
    console.log('prefix: ', prefix)

    const numbers = arrayCode.map((code) => {
      const numPart = code.slice(1)
      return parseInt(numPart, 10) || 0
    })
    console.log('numbers: ', numbers)

    // Calculate next number (ensure minimum 1)
    const maxNumber = Math.max(...numbers, 0) // Handle empty numbers case
    console.log('maxNumber: ', maxNumber)

    const nextNumber = maxNumber

    // Generate final code
    const finalCode = `${prefix}${nextNumber}`
    console.log('finalCode: ', finalCode)

    // Prepare response
    const responseData = [...assetData]
    responseData.push({ name: '', kode: finalCode })

    Request.success(res, { data: responseData })
  } catch (error) {
    Request.error(res, error)
  }
}

hasil log:
validatedCategory:  Elektronik
assetData:  [
  {
    id: '8ea0fd0c-2fa0-43f5-ba58-535fc2c3b4cf',
    name: 'KULKAS',
    category: 'Elektronik',
    kode: 'E1',
    'storage.id': '840cf8c6-3464-4f34-ab63-ce8cc09d6815',
    'storage.unit_id': '89727fe8-6b97-40f2-b7f4-0eb4e2821e2a',
    'storage.building_id': '8317d35f-a64e-49be-8c4f-b31b4d66f2a0',
    'storage.floor_id': '904b1132-f7dd-49fb-b4dd-c32a5461ad68',
    'storage.room_id': 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    'storage.created_at': 2025-06-12T07:16:05.228Z,
    'storage.updated_at': 2025-06-12T07:16:05.228Z,
    'storage.deleted_at': null,
    'storage.unit.id': '89727fe8-6b97-40f2-b7f4-0eb4e2821e2a',
    'storage.unit.name': 'UP2B Bali',
    'storage.building.id': '8317d35f-a64e-49be-8c4f-b31b4d66f2a0',
    'storage.building.name': 'Gedung Opsis',
    'storage.storage_floor.id': '904b1132-f7dd-49fb-b4dd-c32a5461ad68',
    'storage.storage_floor.name': 'Lantai 1',
    'storage.storage_room.id': 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    'storage.storage_room.name': 'Lobby'
  },
  {
    id: 'fc5b4de4-2136-47f2-aa22-3ed7d9609357',
    name: 'RADIO',
    category: 'Elektronik',
    kode: 'E1',
    'storage.id': '840cf8c6-3464-4f34-ab63-ce8cc09d6815',
    'storage.unit_id': '89727fe8-6b97-40f2-b7f4-0eb4e2821e2a',
    'storage.building_id': '8317d35f-a64e-49be-8c4f-b31b4d66f2a0',
    'storage.floor_id': '904b1132-f7dd-49fb-b4dd-c32a5461ad68',
    'storage.room_id': 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    'storage.created_at': 2025-06-12T07:16:05.228Z,
    'storage.updated_at': 2025-06-12T07:16:05.228Z,
    'storage.deleted_at': null,
    'storage.unit.id': '89727fe8-6b97-40f2-b7f4-0eb4e2821e2a',
    'storage.unit.name': 'UP2B Bali',
    'storage.building.id': '8317d35f-a64e-49be-8c4f-b31b4d66f2a0',
    'storage.building.name': 'Gedung Opsis',
    'storage.storage_floor.id': '904b1132-f7dd-49fb-b4dd-c32a5461ad68',
    'storage.storage_floor.name': 'Lantai 1',
    'storage.storage_room.id': 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    'storage.storage_room.name': 'Lobby'
  }
]
sudah ada data sebelumnya
arrayCode:  [ 'E1', 'E1' ]
arrayCode:  [ 'E1', 'E1' ]
prefix:  E
numbers:  [ 1, 1 ]
maxNumber:  1
finalCode:  E1

ini adalah option endpoint untuk menampilkan dropdown.
todo:
refactor kode ini dengan objective berikut:
jika sebelumnya belum pernah ada asset, maka buatlah dropdown untuk hanya mengirimkan 1 kode yang boleh dipakai yaitu inital pertama dari asset kategorinya (Furniture = F, Elektronik = E, Umum = U) dan mulai dari 1. jadi (U1, F1, E1).
notes bahwa kode asset bisa saja sama, tidak unik. 
jika sebelumnya sudah ada assetnya, maka dropdown yang dikirim:
a. list kode di asset sebelumnya yang sudah ada (jika ada yang duplikat maka tampilkan 1 saja)
b. plus 1 kode untuk diisi setelah kode paling besar di list asset sebelumnya

format response:
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            "id": "8ea0fd0c-2fa0-43f5-ba58-535fc2c3b4cf",
            "name": "KULKAS",
            "category": "Elektronik",
            "kode": "E1"
        },
        {
            "id": "fc5b4de4-2136-47f2-aa22-3ed7d9609357",
            "name": "RADIO",
            "category": "Elektronik",
            "kode": "E1"
        },
        {
            "name": "",
            "kode": "E1"
        }
    ]
}

yang name nya kosong itu adalah data yang digunakan untuk render default dropdown, artinya data tersebut adalah kode untuk diisi setelah kode paling besar di list asset sebelumnya.
dapat dilihat di contoh response 2 data sebelumnya punya kode sama yaitu E1. di response yang saya berikan ini salah, karena dia mengirim data dengan kode E1 2 kali. dan data yang namanya kosong kodenya masih E1 juga(harusnya E2: angka setelah E1 di data asset sebelumnya)

ubahlah kode blok hanya didalam try saja