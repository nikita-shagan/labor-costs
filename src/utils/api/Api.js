export default class Api {
  constructor(url) {
    this._baseUrl = url
    this._options = {
      headers: {'Content-Type': 'application/json'},
    }
  }

  _validateQuery(res) {
    return res.ok
      ? res.json()
      : Promise.reject({ code: res.status });
  }

  processQuery(path, method, body = null) {
    const options = { ...this._options }

    options.method = method

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}${path}`, options)
      .then((res) => this._validateQuery(res))
  }
}
