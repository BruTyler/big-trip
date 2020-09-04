import AbstractView from '../abstract/simple-view.js';
import {TabAdditionalItem} from '../const.js';

export const createEventAddButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" value="${TabAdditionalItem.ADD_NEW_EVENT}">
      New event
    </button>`
  );
};

export default class EventAddButton extends AbstractView {
  constructor() {
    super();

  }
  getTemplate() {
    return createEventAddButtonTemplate();
  }

  setDisabledButton(state) {
    this.getElement().disabled = state;
  }
}
