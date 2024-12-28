const User = require('./user')
const Building = require('./building')
const Floor = require('./floor')
const Room = require('./room')
const Asset = require('./asset')
const Condition = require('./condition')
const Unit = require('./unit')
const StorageManagement = require('./storage_management')

const initRelationships = require('./config/relationship')

const models = {
  User,
  Building,
  Floor,
  Room,
  Asset,
  Condition,
  Unit,
  StorageManagement,
}

initRelationships(models)

exports.Models = models
