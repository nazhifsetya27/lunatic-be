const User = require('./user')
const Building = require('./building')
const Floor = require('./floor')

const initRelationships = require('./config/relationship')

const models = {
  User,
  Building,
  Floor,
}

initRelationships(models)

exports.Models = models
