const { Router } = require('express')
const { getAllRoom, store } = require('./room.controller')
const { storeRequest } = require('./room.middleware')

const router = Router()

router.get('/', getAllRoom)

router.post('/', storeRequest, store)

module.exports = router
