export default function clientMiddleware ({ dispatch, getState }) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    // eslint-disable-line no-redeclare
    const { promise, types, ...rest } = action
    if (!promise) {
      return next(action)
    }

    const [REQUEST, SUCCESS, FAILURE] = types

    !!REQUEST && next({ ...rest, type: REQUEST })

    const actionPromise = promise(dispatch, getState)

    try {
      actionPromise
        .then(res => SUCCESS && next({ ...rest, payload: res, type: SUCCESS }))
        .catch(error => FAILURE && next({ ...rest, error, type: FAILURE }))
    } catch (error) {
      console.error('MIDDLEWARE ERROR:', error)
      next({ ...rest, error, type: FAILURE })
    }

    return actionPromise
  }
}
