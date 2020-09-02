import AbstractView from '../abstract/simple-view.js';

export const createEventAddButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class EventAddButton extends AbstractView {
  getTemplate() {
    return createEventAddButtonTemplate();
  }
}
