import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {
  render,
  replace,
  remove
} from '../framework/render.js';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #tripListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #handleDataChange = null;

  constructor({destinations, offer, tripListView, onDataChange}) {
    this.#destinations = destinations;
    this.#offers = offer;
    this.#tripListContainer = tripListView.element;
    this.#handleDataChange = onDataChange;
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

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#tripListContainer.contains(pointComponent.element)) {
      replace(this.#pointComponent, pointComponent);
    }

    if (this.#tripListContainer.contains(editPointComponent.element)) {
      replace(this.#pointComponent, editPointComponent);
    }

    remove(pointComponent);
    remove(editPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #replacePointToForm() {
    this.#pointComponent.element.replaceWith(this.#editPointComponent.element);
  }

  #replaceFormToPoint() {
    this.#editPointComponent.element.replaceWith(this.#pointComponent.element);
  }

  #onOpenEditFormEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint.call(this);
      document.removeEventListener('keydown', this.#onOpenEditFormEscKeyDown);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
