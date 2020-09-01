import EventEditorView from '../view/event-editor.js';
import EventPointView from '../view/event-point.js';
import {RenderPosition, PointMode} from '../const.js';
import {render, replace, remove} from '../utils/render.js';
import {extend} from '../utils/common.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editorComponent = null;
    this._mode = PointMode.DEFAULT;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._replacePointToEditor = this._replacePointToEditor.bind(this);
    this._replaceEditorToPoint = this._replaceEditorToPoint.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleCancelClick.bind(this);
  }

  init(tripEvent, destinations, tripOffers) {
    this._tripEvent = tripEvent;

    const prevPointComponent = this._pointComponent;
    const prevEditorComponent = this._editorComponent;

    this._pointComponent = new EventPointView(this._tripEvent);
    this._editorComponent = new EventEditorView(this._tripEvent, destinations, tripOffers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editorComponent.setCancelClickHandler(this._handleCancelClick);
    this._editorComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevEditorComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === PointMode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === PointMode.EDITING) {
      replace(this._editorComponent, prevEditorComponent);
    }

    remove(prevPointComponent);
    remove(prevEditorComponent);
  }

  resetView() {
    if (this._mode !== PointMode.DEFAULT) {
      this._replaceEditorToPoint();
    }
  }

  _replacePointToEditor() {
    replace(this._editorComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = PointMode.EDITING;
  }

  _replaceEditorToPoint() {
    replace(this._pointComponent, this._editorComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = PointMode.DEFAULT;
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editorComponent.reset();
      this._replaceEditorToPoint();
      document.removeEventListener(`keydown`, this._handleEscKeyDown);
    }
  }

  _handleEditClick() {
    this._replacePointToEditor();
  }

  _handleCancelClick() {
    this._replaceEditorToPoint();
  }

  _handleFavoriteClick() {
    const updatedProperty = {isFavorite: !this._tripEvent.isFavorite};
    const updatedEvent = extend(this._tripEvent, updatedProperty);
    this._changeData(updatedEvent);
  }

  _handleFormSubmit() {
    this._replaceEditorToPoint();
  }
}
