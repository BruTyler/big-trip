import EventEditorView from '../view/event-editor.js';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition, ModelType, EditState} from '../const.js';

export default class PointNew {
  constructor(pointContainer, modelStore, changeData) {
    this._pointContainer = pointContainer;
    this._pointNewModel = modelStore.get(ModelType.POINT_NEW);
    this._changeData = changeData;

    this._editorComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(destinations, tripOffers) {
    if (this._editorComponent !== null) {
      return;
    }

    this._editorComponent = new EventEditorView(destinations, tripOffers);

    this._editorComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._editorComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(this._pointContainer, this._editorComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._editorComponent === null) {
      return;
    }

    remove(this._editorComponent);
    this._editorComponent = null;
    this._pointNewModel.setItem(UpdateType.MINOR, null);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setEditState(editState) {
    if (this._editorComponent === null || editState !== EditState.ABORTED) {
      return;
    }

    const resetFormState = () => {
      this._editorComponent.setEditState(editState);
    };

    this._editorComponent.shake(resetFormState);
  }

  _formSubmitHandler(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
