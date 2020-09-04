import {nanoid} from 'nanoid';
import EventEditorView from '../view/event-editor.js';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition, ModelType} from '../const.js';
import {extend} from '../utils/common.js';

export default class PointNew {
  constructor(pointContainer, modelStore, changeData) {
    this._pointContainer = pointContainer;
    this._pointNewModel = modelStore.get(ModelType.POINT_NEW);
    this._changeData = changeData;

    this._editorComponent = null;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(destinations, tripOffers) {
    if (this._editorComponent !== null) {
      return;
    }

    this._editorComponent = new EventEditorView(destinations, tripOffers);

    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointContainer, this._editorComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._editorComponent === null) {
      return;
    }

    remove(this._editorComponent);
    this._editorComponent = null;
    this._pointNewModel.setItem(UpdateType.MINOR, null);

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        extend(point, {id: nanoid(5)})
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
