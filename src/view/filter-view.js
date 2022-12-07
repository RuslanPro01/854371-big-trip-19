import {createElement} from '../render.js';

function createFilterTemplate() {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form action="#" class="trip-filters" method="get">
          <div class="trip-filters__filter">
            <input class="trip-filters__filter-input  visually-hidden" id="filter-everything" name="trip-filter" type="radio" value="everything">
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
          </div>

          <div class="trip-filters__filter">
            <input class="trip-filters__filter-input  visually-hidden" id="filter-future" name="trip-filter" type="radio" value="future">
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
          </div>

          <div class="trip-filters__filter">
            <input class="trip-filters__filter-input  visually-hidden" id="filter-present" name="trip-filter" type="radio" value="present">
            <label class="trip-filters__filter-label" for="filter-present">Present</label>
          </div>

          <div class="trip-filters__filter">
            <input checked class="trip-filters__filter-input  visually-hidden" id="filter-past" name="trip-filter" type="radio" value="past">
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
          </div>

          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>`
  );
}

export default class FilterView {
  getTemplate() {
    return createFilterTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
