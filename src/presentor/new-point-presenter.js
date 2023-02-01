import AddPointView from '../view/add-point-view.js';
import {
  BLANK_POINT,
  UpdateType,
  UserAction
} from '../const.js';
import {
  remove,
  render,
  RenderPosition
} from '../framework/render.js';

export default class NewPointPresenter {
  #tripListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #addPointView = null;
  #pointsModel = null;


  constructor({tripEventsContainer, onDataChange, onDestroy, pointsModel}) {
    this.#tripListContainer = tripEventsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#addPointView !== null) {
      return;
    }

    this.#addPointView = new AddPointView({
      point: BLANK_POINT,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      cancelButtonHandler: this.#handleDeleteClick,
      formSubmitHandler: this.#handleFormSubmit
    });

    render(this.#addPointView, this.#tripListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  // setSaving() {
  //   this.#addPointView.updateElement({
  //     isDisabled: true,
  //     isSaving: true
  //   });
  // }

  destroy() {
    if (this.#addPointView === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#addPointView);
    this.#addPointView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

