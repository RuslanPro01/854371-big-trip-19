import {render} from '../render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import AddPointView from '../view/add-point-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPresenter {

  tripFiltersView = new TripFiltersView();
  tripSortView = new TripSortView();
  tripListView = new TripListView();

  constructor({filtersContainer, tripEventsContainer}) {
    this.filtersContainer = filtersContainer;
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(this.tripFiltersView, this.filtersContainer);
    render(this.tripSortView, this.tripEventsContainer);
    render(this.tripListView, this.tripEventsContainer);
    render(new AddPointView(), this.tripListView.getElement());
    for (let i = 3; i > 0; i--) {
      render(new PointView(), this.tripListView.getElement());
    }
    render(new EditPointView(), this.tripListView.getElement());
  }
}