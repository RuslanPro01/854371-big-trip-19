import {render} from '../render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import AddPointView from '../view/add-point-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPresenter {
  #filtersContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;

  #tripFiltersView = new TripFiltersView();
  #tripSortView = new TripSortView();
  #tripListView = new TripListView();

  #points = [];
  #destinations = [];
  #offers = [];

  constructor({filtersContainer, tripEventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    render(this.#tripFiltersView, this.#filtersContainer);
    render(this.#tripSortView, this.#tripEventsContainer);
    render(this.#tripListView, this.#tripEventsContainer);
    render(new AddPointView(), this.#tripListView.element);
    for (let i = 0; i < 3; i++) {
      render(new PointView({
        point: this.#points[i],
        destinations: this.#destinations,
        offers: this.#offers
      }), this.#tripListView.element);
    }
    render(new EditPointView({
      point: this.#points[3],
      destinations: this.#destinations,
      offers: this.#offers
    }), this.#tripListView.element);
  }
}
