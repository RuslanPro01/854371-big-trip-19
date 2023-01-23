import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {
  render,
  replace,
  remove
} from '../framework/render.js';
import {Mode} from '../const.js';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #tripListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #action = null;

  #mode = Mode.DEFAULT;

  constructor({destinations, offer, tripListView, onDataChange, onModeChange}) {
    this.#destinations = destinations;
    this.#offers = offer;
    this.#tripListContainer = tripListView.element;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#renderPoint(this.#point, this.#destinations, this.#offers);
  }

  #renderPoint(point, destinations, offers) {
    const pointComponent = this.#pointComponent;
    const editPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: point,
      destinations: destinations,
      offers: offers,
      onClick: () => {
        this.#replacePointToForm.call(this);
        document.addEventListener('keydown', this.#onOpenEditFormEscKeyDown);
        this.#editPointComponent.reset(this.#point);
      },
      onFavoriteButtonClick: this.#handleFavoriteClick
    });

    this.#editPointComponent = new EditPointView({
      point: point,
      destinations: destinations,
      offers: offers,
      onClick: () => {
        this.#replaceFormToPoint.call(this);
      }
    });

    if (pointComponent === null || editPointComponent === null) {
      render(this.#pointComponent, this.#tripListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, pointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, editPointComponent);
    }

    remove(pointComponent);
    remove(editPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #replacePointToForm() {
    this.#pointComponent.element.replaceWith(this.#editPointComponent.element);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    this.#editPointComponent.element.replaceWith(this.#pointComponent.element);
    this.#mode = Mode.DEFAULT;
  }

  #onOpenEditFormEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint.call(this);
      document.removeEventListener('keydown', this.#onOpenEditFormEscKeyDown);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
