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
      headers: new Headers({'ContentType': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  #pointAdaptToServer(point) {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
