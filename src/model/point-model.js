import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pontApiService = null;

  constructor({pointApiService}) {
    super();
    this.#pontApiService = pointApiService;
  }

  async init() {
    try {
      const allPoints = await this.#pontApiService.points;
      this.#points = allPoints.map(this.#pointAdaptToClient);
    } catch (error) {
      this.#points = [];
    }
    try {
      this.#destinations = await this.#pontApiService.destinations;
    } catch (error) {
      this.#destinations = [];
    }
    try {
      this.#offers = await this.#pontApiService.offers;
    } catch (error) {
      this.#offers = [];
    }
  }

  #pointAdaptToClient(point) {
    const adaptedPoint = {...point,
      'basePrice': point['base_price'],
      'dateForm': point['date_from'],
      'dateTo': point['date_to'],
      'isFavorite': point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
