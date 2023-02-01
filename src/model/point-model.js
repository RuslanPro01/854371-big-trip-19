import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

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
    this._notify(UpdateType.INIT);
  }

  #pointAdaptToClient(point) {
    const adaptedPoint = {...point,
      'basePrice': point['base_price'],
      'dayFrom': point['date_from'],
      'dayTo': point['date_to'],
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

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    try {
      const response = await this.#pontApiService.updatePoint(update);
      const updatedPoint = this.#pointAdaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(error) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pontApiService.addPoint(update);
      const adaptedPoint = this.#pointAdaptToClient(response);

      this.#points = [
        adaptedPoint,
        ...this.#points,
      ];

      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
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
