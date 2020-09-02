export const ObserverDecorator = (superclass = Object) => class extends superclass {
  constructor() {
    super();
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
};

// eslint-disable-next-line new-cap
export default ObserverDecorator(Object);
