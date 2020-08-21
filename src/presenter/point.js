import EventEditorView from '../view/event-editor.js';
import EventPointView from '../view/event-point.js';
import {RenderPosition} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._replacePointToEditor = this._replacePointToEditor.bind(this);
    this._replaceEditorToPoint = this._replaceEditorToPoint.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleCancelClick.bind(this);
  }

  init(tripEvent, destinations, tripOffers) {
    this._tripEvent = tripEvent;
    this._pointComponent = new EventPointView(this._tripEvent);
    this._editorComponent = new EventEditorView(this._tripEvent, destinations, tripOffers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editorComponent.setCancelClickHandler(this._handleCancelClick);
    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editorComponent);
  }

  _replacePointToEditor() {
    replace(this._editorComponent, this._pointComponent);
  }

  _replaceEditorToPoint() {
    replace(this._pointComponent, this._editorComponent);
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditorToPoint();
      document.removeEventListener(`keydown`, this._handleEscKeyDown);
    }
  }

  _handleEditClick() {
    this._replacePointToEditor();
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleCancelClick() {
    this._replaceEditorToPoint();
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit() {
    this._replaceEditorToPoint();
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }
}
