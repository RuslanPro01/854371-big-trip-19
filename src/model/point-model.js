import {points} from '../mock/points.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offer.js';

export default class PointModel {
  #points = points;
  #destinations = destinations;
  #offers = offers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
