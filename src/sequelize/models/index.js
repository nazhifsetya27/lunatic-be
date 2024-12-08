const User = require('./user')
const Gedung = require('./gedung')
const Floor = require('./floor')

const initRelationships = require('./config/relationship')

const models = {
  User,
  Gedung,
  Floor,
}

initRelationships(models)

exports.Models = models
