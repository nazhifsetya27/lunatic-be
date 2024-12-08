const User = require('./user')
const Building = require('./building')
const Floor = require('./floor')
const Room = require('./room')
const Asset = require('./asset')

const initRelationships = require('./config/relationship')

const models = {
  User,
  Building,
  Floor,
  Room,
  Asset,
}

initRelationships(models)

exports.Models = models
