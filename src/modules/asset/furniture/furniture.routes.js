const express = require('express')
const {
  index,
  store,
  remove,
  restore,
  detail,
  show,
  update,
  printCode,
  imports,
  example,
  exampleAll,
  importAll,
  exportDataAll,
} = require('./furniture.controller')
const {
  storeRequest,
  updateRequest,
  importRequest,
  importAllRequest,
} = require('./furniture.middleware')

const router = express.Router()

router.get('/', index)
router.get('/example', example)
router.get('/exampleAll', exampleAll) // buat all numpang di furniture
router.get('/exportAll', exportDataAll) // sama numpang juga
router.get('/:id', show)
router.get('/:id/detail', detail)
router.get('/:id/print', printCode)

router.post('/', storeRequest, store)
router.post('/import', importRequest, imports)
router.post('/importAll', importAllRequest, importAll)

router.patch('/:id', updateRequest, update)
router.patch('/:id/restore', restore)

router.delete('/:id', remove)

module.exports = router
