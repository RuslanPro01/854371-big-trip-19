import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#pointAdaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#pointAdaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  #pointAdaptToServer(point) {
    const adaptedPoint = {...point,
      'base_price': +point.basePrice,
      'date_from': point.dayFrom,
      'date_to': point.dayTo,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dayFrom;
    delete adaptedPoint.dayTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
