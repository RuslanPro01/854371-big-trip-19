import {render} from '../framework/render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripListEmptyView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {
  NUMBER_POINTS_CREATED,
  SortType
} from '../const.js';
import {updateItem} from '../utils/common-utils.js';
import {
  sortPriceDown,
  sortTimeDown
} from '../utils/utils-point-view.js';

export default class PointsListPresenter {
  #filtersContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripFiltersView = null;

  #tripSortView = null;
  #tripListView = new TripListView();
  #tripListEmptyView = new TripListEmptyView();
  #pointPresenter = null;
  #pointPresenters = new Map();

  #points = [];
  #destinations = [];
  #offers = [];
  #currentSortType = SortType.DEFAULT;
  #sourcedPoints = [];

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
      this.#sourcedPoints = [...this.#pointsModel.points];
      this.#destinations = [...this.#pointsModel.destinations];
      this.#offers = [...this.#pointsModel.offers];
      this.#tripFiltersView = new TripFiltersView({points: this.#points});

      render(this.#tripFiltersView, this.#filtersContainer);
      this.#renderSort();
      render(this.#tripListView, this.#tripEventsContainer);
      this.#renderPoints();
    } else {
      render(this.#tripListEmptyView, this.#tripEventsContainer);
    }
  }

  #renderPoints() {
    for (let i = 0; i < NUMBER_POINTS_CREATED; i++) {
      this.#pointPresenter = new PointPresenter({
        offer: this.#offers,
        destinations: this.#destinations,
        tripListView: this.#tripListView,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModChange
      });
      this.#pointPresenter.init(this.#points[i]);
      this.#pointPresenters.set(this.#points[i].id, this.#pointPresenter);
    }
  }

  #handleModChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatePoint) => {
    this.#points = updateItem(this.#points, updatePoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPriceDown);
        break;
      case SortType.DURATION:
        this.#points.sort(sortTimeDown);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };

  #renderSort() {
    this.#tripSortView = new TripSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#tripSortView, this.#tripEventsContainer);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
