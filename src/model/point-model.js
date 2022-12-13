import {points} from '../mock/points.js';

export default class PointModel {
  points = points;

  getPoints() {
    return this.points;
  }
}
