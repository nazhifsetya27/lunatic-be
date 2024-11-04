exports.success = (res, data) =>
  res?.status(200).send({
    status: 200,
    message: 'Success',
    ...data,
  })

exports.notFound = (res, err) => {
  if (typeof err !== 'string') console.error(err)
  res.status(404).send({
    status: 404,
    message: 'Not Found',
  })
}

exports.created = (res, data) =>
  res.status(201).send({
    status: 201,
    message: 'Created',
    ...data,
  })

exports.unAuthorized = (res, data) =>
  res.status(401).send({
    status: 401,
    message: 'Not Authorized',
  })

exports.error = (res, err) => {
  let message = err
  let detail

  if (err.name === 'FlowError') {
    message = err?.message
  } else if (typeof err !== 'string') {
    console.error(err, err.name)
    detail = err?.message
    message = 'Internal Server Error!'
  }

  res?.status(500).send({
    status: 500,
    message,
    detail,
  })
}

exports.badRequest = (res, errors) => {
  res.status(400).send({
    status: 400,
    title: 'Bad Request',
    message: errors.errors
      ? errors.errors.find((e) => e)?.msg
      : 'Something wrong',
    ...errors,
  })
}
