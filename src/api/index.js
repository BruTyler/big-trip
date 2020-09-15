import {HTTPMethod, SuccessHTTPStatusRange} from '../const.js';
import PointsModel from '../model/points.js';
import DestinationsModel from '../model/destinations.js';
import OffersModel from '../model/offers.js';

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON)
      .then((destinations) => destinations.map(DestinationsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON)
      .then((offers) => offers.map(OffersModel.adaptToClient));
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: HTTPMethod.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: HTTPMethod.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: HTTPMethod.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: HTTPMethod.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = HTTPMethod.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
