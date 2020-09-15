import EventEditorView from '../view/event-editor.js';
import EventPointView from '../view/event-point.js';
import {RenderPosition, PointMode, UpdateType, UserAction, EditState} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editorComponent = null;
    this._mode = PointMode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToEditor = this._replacePointToEditor.bind(this);
    this._replaceEditorToPoint = this._replaceEditorToPoint.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(tripEvent, destinations, tripOffers) {
    this._tripEvent = tripEvent;

    const prevPointComponent = this._pointComponent;
    const prevEditorComponent = this._editorComponent;

    this._pointComponent = new EventPointView(this._tripEvent);
    this._editorComponent = new EventEditorView(destinations, tripOffers, this._tripEvent);

    this._pointComponent.setEditClickHandler(this._editClickHandler);
    this._editorComponent.setCancelClickHandler(this._cancelClickHandler);
    this._editorComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._editorComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._editorComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (prevPointComponent === null || prevEditorComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFORE_END);
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

  setEditState(editState) {
    if (this._editorComponent === null) {
      return;
    }

    if (editState === EditState.SUCCEED) {
      this._replaceEditorToPoint();
      return;
    }

    const resetFormState = () => {
      this._editorComponent.setEditState(editState);
    };

    this._editorComponent.shake(resetFormState);
  }

  _replacePointToEditor() {
    replace(this._editorComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = PointMode.EDITING;
  }

  _replaceEditorToPoint() {
    replace(this._pointComponent, this._editorComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = PointMode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editorComponent.reset();
      this._replaceEditorToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _editClickHandler() {
    this._replacePointToEditor();
  }

  _cancelClickHandler() {
    this._replaceEditorToPoint();
  }

  _deleteClickHandler() {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, this._tripEvent);
  }

  _favoriteClickHandler(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  }

  _formSubmitHandler(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
  }
}
