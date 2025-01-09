const { isArray, isEmpty } = require('lodash')
const { Op } = require('sequelize')

const symbolRaw = {
  in: 'in',
  like: 'ilike',
  ilike: 'ilike',
  'not-like': 'NOT ILIKE',
  ne: 'NOT ILIKE',
  is: '=',
  not: '!=',
  '>': '>',
  '>=': '>=',
  '<': '<',
  '<=': '<=',
}
const symbol = {
  in: Op.in,
  like: Op.like,
  ilike: Op.iLike,
  'not-like': Op.notILike,
  ne: Op.notILike,
  is: Op.eq,
  '>': Op.gt,
  '=>': Op.gte,
  '<': Op.lt,
  '<=': Op.lte,
}
exports.symbol = symbol
exports.symbolRaw = symbolRaw
exports.filter = (
  name,
  label,
  type,
  { path, key, typeData, optionLabel, unique } = {}
) => {
  switch (type) {
    case 'multi':
      if (!path) throw 'path is required'
      if (!key) throw 'key is required'
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'in' },
          { label: 'is any of', value: 'in' },
          { label: 'is none of', value: 'not-in' },
          { label: 'not', value: 'not-in' },
        ],
        path,
        key,
        typeData,
        optionLabel,
        unique,
      }
    case 'string':
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: 'contain', value: 'ilike' },
          { label: 'not', value: 'ne' },
        ],
        typeData,
        unique,
      }
    case 'boolean':
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: 'not', value: 'ne' },
        ],
        typeData,
        unique,
      }
    case 'number':
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: '>', value: '>' },
          { label: '≥', value: '=>' },
          { label: '<', value: '<' },
          { label: '≤', value: '<=' },
          { label: 'not', value: 'ne' },
        ],
        typeData,
        unique,
      }
    case 'date':
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: '>', value: '>=' },
          { label: '<', value: '<=' },
          { label: 'not', value: 'not' },
        ],
        typeData,
        unique,
      }
    case 'select':
      if (!path) throw 'path is required'
      if (!key) throw 'key is required'
      return {
        name,
        label,
        type,
        options: [
          { label: 'is', value: 'like' },
          { label: 'is none of', value: 'not-like' },
        ],
        path,
        key,
        typeData,
        optionLabel,
        unique,
      }
    default:
      break
  }
}
exports.parseFilter = (filter, model) => {
  const { sequelize } = model
  const where = {}

  filter.forEach((e) => {
    if (!e.value) return
    if (e.filter.unique) return
    const operator = (e.operator?.label ?? 'and') === 'and' ? Op.and : Op.or
    if (!where[operator]) where[operator] = []
    where[operator].push(
      e.filter.typeData && e.filter.typeData === 'json'
        ? sequelize.literal(
            `CAST(${e.field} as TEXT) ${symbolRaw[e.condition.value]} '%${
              e.filter.key
                ? isArray(e.value)
                  ? e.value.map((value) => value[e.filter.key])
                  : e.value[e.filter.key]
                : e.value
            }%'`
          )
        : e.filter.type === 'date'
          ? sequelize.where(
              sequelize.fn('date', sequelize.col(`${model.name}.${e.field}`)),
              symbolRaw[e.condition.value],
              e.value
            )
          : {
              [e.field]: {
                [symbol[e.condition.value]]: e.filter.key
                  ? isArray(e.value)
                    ? e.value.map((value) => value[e.filter.key])
                    : e.value[e.filter.key]
                  : e.condition.value.includes('like')
                    ? `%${e.value}%`
                    : e.value,
              },
            }
    )
  })
  // return isEmpty(where) ? null : where;
  return where
}
exports.myParseFilter = (filter, model) => {
  const { sequelize } = model
  const where = {}

  const newFilter = filter.sort((a, b) =>
    a.filter.label.localeCompare(b.filter.label)
  )
  // console.log('flter', newFilter)
  const myFilter = []
  for (let i = 0; i < newFilter.length; i++) {
    var nf = newFilter[i]
    if (i === 0) {
      myFilter.push(nf)
      continue
    } else if (newFilter[i - 1].filter?.label === nf.filter?.label) {
      // value array obj id
      const idx = myFilter.findIndex(
        (e) => e?.filter?.label === nf.filter?.label
      )
      myFilter[idx].condition.value = 'in'
      if (Array.isArray(myFilter[idx].value)) {
        myFilter[idx].value = [...myFilter[idx].value, nf.value]
      } else {
        myFilter[idx].value = [myFilter[idx].value, nf.value]
      }
    } else {
      myFilter.push(nf)
      continue
    }
  }

  myFilter.forEach((e) => {
    if (!e.value) return
    if (e.filter.unique) return
    const operator = (e.operator?.label ?? 'and') == 'and' ? Op.and : Op.or
    if (!where[operator]) where[operator] = []
    where[operator].push(
      e.filter.typeData && e.filter.typeData == 'json'
        ? sequelize.literal(
            `CAST(${e.field} as TEXT) ${symbolRaw[e.condition.value]} '%${
              e.filter.key
                ? isArray(e.value)
                  ? e.value.map((value) => value[e.filter.key])
                  : e.value[e.filter.key]
                : e.value
            }%'`
          )
        : e.filter.type == 'date'
          ? sequelize.where(
              sequelize.fn('date', sequelize.col(`${model.name}.${e.field}`)),
              symbolRaw[e.condition.value],
              e.value
            )
          : {
              [e.field]: {
                [symbol[e.condition.value]]: e.filter.key
                  ? isArray(e.value)
                    ? e.value.map((value) => value[e.filter.key]) // e.value.filter.key?
                    : e.value[e.filter.key]
                  : e.condition.value.includes('like')
                    ? `%${e.value}%`
                    : e.value,
              },
            }
    )
  })
  // return isEmpty(where) ? null : where;
  return where
}

exports.sort = (name, type, path) => {
  switch (type) {
    case 'multi':
      if (!path) throw 'path is required'
      return {
        name,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: 'is any of', value: 'in' },
          { label: 'is none of', value: 'not-in' },
          { label: 'not', value: 'ne' },
        ],
        path,
      }
    case 'string':
      return {
        name,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: 'contain', value: 'ilike' },
          { label: 'not', value: 'ne' },
        ],
      }
    case 'number':
      return {
        name,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: '>', value: '>' },
          { label: '=>', value: '=>' },
          { label: '<', value: '<' },
          { label: '<=', value: '<=' },
          { label: 'not', value: 'ne' },
        ],
      }
    case 'date':
      return {
        name,
        type,
        options: [
          { label: 'is', value: 'is' },
          { label: '>', value: '>' },
          { label: '<', value: '<' },
          { label: 'not', value: 'ne' },
        ],
      }
    default:
      break
  }
}
