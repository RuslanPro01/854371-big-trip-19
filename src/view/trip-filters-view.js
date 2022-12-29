import AbstractView from '../framework/view/abstract-view.js';
import {
  isAfterTime,
  isBeforeTime,
  isSameTime
} from '../utils/utils-filter.js';

function createTripControlsFiltersTemplate(points) {
  const countFuturePoints = points.filter(({dayFrom}) => isAfterTime(dayFrom)).length;
  const countPresentPoints = points.filter(({dayFrom, dayTo}) => (isBeforeTime(dayFrom) || isSameTime(dayFrom)) && (isAfterTime(dayTo) || isSameTime(dayTo))).length;
  const countPastPoints = points.filter(({dayTo}) => isBeforeTime(dayTo)).length;
  const filterIsAvailable = (counter) => {
    if (counter <= 0) {
      return 'disabled';
    }
    return '';
  };

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${filterIsAvailable(countFuturePoints)}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" ${filterIsAvailable(countPresentPoints)}>
        <label class="trip-filters__filter-label" for="filter-present">Present</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${filterIsAvailable(countPastPoints)}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class TripFiltersView extends AbstractView {
  #points = null;

  constructor({points}) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripControlsFiltersTemplate(this.#points);
  }
}
