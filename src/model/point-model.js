import {points} from '../mock/points.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offer.js';

export default class PointModel {
  points = points;
  destinations = destinations;
  offers = offers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
