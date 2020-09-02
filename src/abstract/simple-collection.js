export const SimpleCollectionDecorator = (superclass = Object) => class extends superclass {
  constructor() {
    super();
    this._items = [];
  }

  setItems(items) {
    this._items = items.slice();
  }

  getItems() {
    return this._items;
  }
};

// eslint-disable-next-line new-cap
export default SimpleCollectionDecorator(Object);
