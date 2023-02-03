import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {
  render,
  replace,
  remove
} from '../framework/render.js';
import {Mode} from '../const.js';
import {
  UserAction,
  UpdateType
} from '../const.js';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #tripListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

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
      onFormSubmit: this.#handleSaveButtonClick,
      onDeleteClick: this.#handleDeleteButtonClick,
      onCancelButtonClick: this.#onCancelButtonClick,
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
      this.#mode = Mode.DEFAULT;
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#editPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
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

  #onCancelButtonClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToPoint.call(this);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleSaveButtonClick = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeleteButtonClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
