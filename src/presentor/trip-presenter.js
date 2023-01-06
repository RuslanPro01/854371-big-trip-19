import {render} from '../framework/render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripListEmptyView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {NUMBER_POINTS_CREATED} from '../const.js';
import {updateItem} from '../utils/common-utils.js';

export default class TripPresenter {
  #filtersContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripFiltersView = null;

  #tripSortView = new TripSortView();
  #tripListView = new TripListView();
  #tripListEmptyView = new TripListEmptyView();
  #pointPresenter = null;
  #pointPresenters = new Map();

  #points = [];
  #destinations = [];
  #offers = [];

  constructor({filtersContainer, tripEventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#installEnvironmentTemplate();
  }

  #installEnvironmentTemplate() {
    if (this.#pointsModel.points) {
      this.#points = [...this.#pointsModel.points];
      this.#destinations = [...this.#pointsModel.destinations];
      this.#offers = [...this.#pointsModel.offers];
      this.#tripFiltersView = new TripFiltersView({points: this.#points});

      render(this.#tripFiltersView, this.#filtersContainer);
      render(this.#tripSortView, this.#tripEventsContainer);
      render(this.#tripListView, this.#tripEventsContainer);
      for (let i = 0; i < NUMBER_POINTS_CREATED; i++) {
        this.#pointPresenter = new PointPresenter({
          offer: this.#offers,
          destinations: this.#destinations,
          tripListView: this.#tripListView,
          onDataChange: this.#handlePointChange
        });
        this.#pointPresenter.init(this.#points[i]);
        this.#pointPresenters.set(this.#points[i].id, this.#pointPresenter);
      }
    } else {
      render(this.#tripListEmptyView, this.#tripEventsContainer);
    }
  }

  #handlePointChange = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
